<template>
  <div>
    <h3 class="view-title">BBS View #{{postId}}</h3>
    <table class="table-default">
      <tr>
        <th>Title</th>
        <td>
          {{postDetails.post.title}}
        </td>
      </tr>
      <tr>
        <th>Content</th>
        <td>
          {{postDetails.post.content}}
        </td>
      </tr>
      <tr>
        <th>Files</th>
        <td>
          <div v-for="(file, index) in postDetails.post.attachedFile.attachedFileInfos" :key="index">
            <a
              :href="`http://public.flexink.com:9250/api/public/bbs/post/file/${postDetails.post.id}/${postDetails.post.attachedFile.id}/${file.id}`">
              <img
                :src="
                `http://public.flexink.com:9250/api/public/bbs/post/file/${postDetails.post.id}/${postDetails.post.attachedFile.id}/${file.id}`"
                alt="" style="height: 50px;">
              <p style="margin-bottom: 30px;">{{file.filename}}</p>
            </a>
          </div>
        </td>
      </tr>
    </table>
    <div class="action-button">
      <router-link to="/bbs/list" class="btn btn-primary-outlined">List</router-link>
      <router-link :to="`/bbs/modify/${postId}`" class="btn btn-primary">Modify</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router'
const route = useRoute()
const postId = route.params.id

const postDetails = reactive({
  post: {
    id: 0,
    title: '',
    content: '',
    attachedFile: {
      id: 0,
      attachedFileInfos: [
        {
          id: '',
          filename: ''
        }
      ]
    }
  },
  error: ''
})

onMounted(async () => {
  
  // postDetails.post = {}
  const resp = await fetch(`http://public.flexink.com:9250/api/public/bbs/post/${postId}`, {
    headers: {
      accept: 'application/json'
    }
  })

  if (resp.ok) {
    const json = await resp.json()
    postDetails.error = ''
    postDetails.post = json
    // console.log(json);
  } else {
    postDetails.error = "Failed to fetch post."
  }
})
</script>