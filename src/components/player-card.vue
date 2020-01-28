<template>
  <f7-list-item :title="player.first_name" :subtitle="player.position" :text="player.date_of_birth">
      <img class="profile-img" src="https://placeimg.com/80/80/people/1" slot="media">
  </f7-list-item>
</template>
<script>
export default {
  props: ["player"]
};
</script>

<style scoped>
.profile-img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
</style>
