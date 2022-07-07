<template>
  <div>
    <h3 class="view-title">BBS List</h3>
    <table class="table-default">
      <tr>
        <th>No.</th>
        <th>Title</th>
        <th>Views</th>
      </tr>
      <tr v-for="(post, index) in postList.posts" :key="index">
        <td>{{post.id}}</td>
        <td>
          <router-link :to="`/bbs/view/${post.id}`">
            {{post.title}}
          </router-link>
        </td>
        <td>{{post.views}}</td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { RouterLink } from 'vue-router'

interface postList {
  id: Number,
  title: String,
  views: Number
}

const postList = reactive({
  posts: Array<postList>(),
  error: ''
})

onMounted(async () => {
  postList.posts = []
  const resp = await fetch("http://public.flexink.com:9250/api/public/bbs/post", {
    headers: {
      accept: 'application/json'
    }
  })

  if (resp.ok) {
    const json = await resp.json()
    postList.error = ''
    postList.posts = json.data
    console.log(json.data);
  } else {
    postList.error = "Failed to fetch post."
  }
})

</script>