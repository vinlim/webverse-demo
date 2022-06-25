<template>
  <div style="position: absolute; height: 100%; width: 100%;">
    <a-scene background="color: lightblue" physics="driver: ammo; debug: true; debugDrawMode: 1;">
      <a-assets>
        <img id="ground" src="@/assets/textures/floor-museum.jpg">
        <img id="art-louis" src="@/assets/textures/art-louis.jpg">
        <a-asset-item id="gallery" src="../scene.gltf"></a-asset-item>
      </a-assets>

      <!-- Textured plane parallel to ground. -->
      <!--      <a-plane src="#ground" height="100" width="100"-->
      <!--               rotation="-90 0 0" repeat="3 3"-->
      <!--               displacement-texture-repeat="2"-->
      <!--               normal-texture-repeat="1 1"></a-plane>-->
      <!--      <a-cylinder color="red" position="0 10 0"></a-cylinder>-->
      <a-entity id="rig">
        <a-entity camera position="0 12 0" look-controls wasd-controls="fly: true;">
          <a-cursor id="cursor" raycaster fuse="true" fusetimeout="5000"></a-cursor>
        </a-entity>
      </a-entity>
      <a-gltf-model src="#gallery" position="0 0 0" scale="0.2 0.2 0.2"></a-gltf-model>
      <a-box scale="1 1 1" color="white" position="30 50 0" light="type: ambient; color: #fff; intensity: 2;"></a-box>
      <a-image v-if="selectedNFTs.includes(0)" :src="this.NFTs[0]?.metadata.image" position="-15.25 22.5 -19.5" rotation="0 90 0" scale="24 15.5 10"></a-image>
      <a-image v-if="selectedNFTs.includes(1)" :src="this.NFTs[1]?.metadata.image" position="-15.25 22.5 22" rotation="0 90 0" scale="24 15.5 10"></a-image>
      <a-image v-if="selectedNFTs.includes(2)" :src="this.NFTs[2]?.metadata.image" position="78.4 22.5 22" rotation="0 90 0" scale="24 15.5 10"></a-image>
      <a-image v-if="selectedNFTs.includes(3)" :src="this.NFTs[3]?.metadata.image" position="78.4 22.5 -19.5" rotation="0 90 0" scale="24 15.5 10"></a-image>
    </a-scene>
  </div>
  <div class="absolute w-full">
    <div class="flex justify-between w-full align-middle m-2">
      <div>
        <button v-if="!user" class="border-2 p-2 bg-white" v-on:click="login">Login</button>
        <div v-if="user" class="border-2 p-2 bg-white">{{ this.user?.attributes.accounts[0] }}</div>
      </div>
      <div class="flex w-80 space-x-2 overflow-x-auto">
        <div v-for="(nft, index) in NFTs" v-if="NFTs.length > 0">
          <img class="w-20" :class="{'border-2 border-red-800': this.selectedNFTs.includes(index)}" style="max-width: max-content !important;" :src="nft?.metadata.image"
               v-on:click="toggle(index)">
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import AFRAME from 'aframe';
import MoralisService from "../services/MoralisService";

export default {
  components: {
    AFRAME
  },
  data: () => {
    return {
      user: null,
      NFTs: [],
      selectedNFTs: [],
    }
  },
  methods: {
    async login() {
      this.user = await MoralisService.login();
      await this.getNFTs();
    },
    async getNFTs() {
      this.NFTs = await MoralisService.getNFT();
    },
    toggle(index) {
      if (this.selectedNFTs.includes(index)) {
        this.selectedNFTs = this.selectedNFTs.filter((item) => {
          return item !== index;
        });
      } else {
        this.selectedNFTs.push(index);
      }
      console.log(this.selectedNFTs);
    }
  }
}
</script>
