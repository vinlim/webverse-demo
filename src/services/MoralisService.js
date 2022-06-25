import axios from "axios";
import Moralis from "moralis";

export default {
    init() {
        Moralis.start({
            serverUrl: import.meta.env.VITE_MORALIS_SERVER_URL,
            appId: import.meta.env.VITE_MORALIS_APP_ID,
            plugins: []
        });
    },
    //
    // enableWeb3() {
    //     Moralis.enableWeb3();
    // },

    // async getUser(identifier) {
    //     const params = {identifier}
    //     const users = await Moralis.Cloud.run('getUser', params);
    //     if (users.length > 0) {
    //         return users[0];
    //     }
    //
    //     throw 'No such user';
    // },
    //
    async login() {
        return new Promise((resolve, reject) => {

            Moralis.authenticate({
                signingMessage: "Sign this transaction to log on to Arteesan. This transaction does not require any fee.",
                chainId: 80001
            })
                .then(function (user) {
                    resolve(user);
                })
                .catch(function (error) {
                    reject(error);
                });
        })
    },
    //
    // async logout() {
    //     return Moralis.User.logOut().then(() => {
    //     });
    // },
    //
    async getNFT() {
        let userEthNFTs = await Moralis.Web3API.account.getNFTs({
            chain: 'mumbai'
        });

        let delay = 0;
        const delayIncrement = 2000;
        return await Promise.all(userEthNFTs.result
            .map(async (nft) => {
                delay += delayIncrement;
                return new Promise(resolve => setTimeout(resolve, delay)).then(() =>
                    this.parseNFT(nft)
                );
            })
        );
    },

    async parseNFT(nft, delay) {
        if (!nft.metadata) {
            const res = await axios.get(nft.token_uri);
            nft.metadata = res.data;
        }

        if (typeof nft.metadata === 'string') {
            nft.metadata = JSON.parse(nft.metadata);
        }

        nft.imageUrl = '';
        if (nft.metadata && nft.metadata.image) {
            if (nft.metadata.image.startsWith('ipfs://ipfs/')) {
                nft.imageUrl = nft.metadata.image.replace('ipfs://ipfs/', 'https://ipfs.io/ipfs/');
            }
            if (!nft.imageUrl && nft.metadata.image.startsWith('ipfs://')) {
                nft.imageUrl = nft.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
            }
            if (!nft.imageUrl && nft.metadata.image.startsWith('http')) {
                nft.imageUrl = nft.metadata.image;
            }

            // nft.imageUrl = nft.metadata.image.replace('ipfs://ipfs/', 'https://ipfs.moralis.io:2053/ipfs/');
        }

        if (!nft.imageUrl && nft.metadata && nft.metadata.image_url) {
            nft.imageUrl = nft.metadata.image_url;
        }

        return nft;
    },
}




