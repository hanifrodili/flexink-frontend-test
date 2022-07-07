<template>
  <div>
    <h3 class="view-title">BBS Register</h3>
    <form id="inputForm">
      <table class="table-default">
        <tr>
          <th>Title</th>
          <td>
            <input type="text" name="title" v-model="title">
          </td>
        </tr>
        <tr>
          <th>Content</th>
          <td>
            <textarea cols="30" rows="10" name="content" v-model="content"></textarea>
          </td>
        </tr>
        <tr>
          <th>Files</th>
          <td>
            <div v-if="uploadResp[0].fileSize">
              <div style="display:flex; flex-direction:row; gap:5px" v-for="(file, index) in uploadResp" :key="index">
                <!-- <a :href="`http://public.flexink.com:9250/api/public/bbs/post/file/${uploadResp[0].originalFilename}`"> -->
                <!-- <img :src="
                  `http://public.flexink.com:9250/api/public/bbs/post/file/${uploadResp[0].originalFilename}`" alt=""
                    style="height: 50px;"> -->
                <p style="margin-bottom: 30px;">{{ file.originalFilename}}
                </p>
                <!-- </a> -->
                <p style="height:20px; width:20px; padding:5px; border-radius:50%; background-color: salmon; display: flex; align-items: center; justify-content: center; cursor: pointer;"
                  @click="deleteNewImage(uploadResp[0].originalFilename)">X</p>
              </div>
            </div>
            <div v-if="postDetails.post.attachedFile.id"
              v-for="(file, index) in postDetails.post.attachedFile.attachedFileInfos" :key="index">
              <div style="display:flex; flex-direction:row; gap:5px">
                <a
                  :href="`http://public.flexink.com:9250/api/public/bbs/post/file/${postDetails.post.id}/${postDetails.post.attachedFile.id}/${file.id}`">
                  <img
                    :src="
                    `http://public.flexink.com:9250/api/public/bbs/post/file/${postId}/${postDetails.post.attachedFile.id}/${file.id}`"
                    alt="" style="height: 50px;">

                  <p style="margin-bottom: 30px;">{{file.filename}}</p>
                </a>
                <p style="height:20px; width:20px; padding:5px; border-radius:50%; background-color: salmon; display: flex; align-items: center; justify-content: center; cursor: pointer;"
                  @click="deleteExistingImage(`${postDetails.post.id}/${postDetails.post.attachedFile.id}/${file.id}`)">
                  x</p>
              </div>
            </div>
            <input type="file" id="image" @change="uploadImage">
          </td>
        </tr>
      </table>
      <div class="action-button">
        <button v-if="!postId" class="btn btn-primary" @click.prevent="registerBBS">
          Save
        </button>
        <button v-if="postId" class="btn btn-primary-outlined">
          List
        </button>
        <button v-if="postId" class="btn btn-warning-outlined" @click.prevent="deleteBBS">
          Delete
        </button>
        <button v-if="postId" class="btn btn-primary" @click.prevent="updateBBS">
          Modify
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
let postId = route.params.id
let title = ref('')
let content = ref('')

let uploadResp = reactive([
  {
    filename: "",
    originalFilename: "",
    fileSize: 0,
    contentType: "" 
  }
])

const postDetails = reactive({
  post: {
    id: 0,
    title: '',
    content: '',
    attachedFile: {
      id: 0,
      attachedFileInfos: [
        {
          id: 0,
          filename: ''
        }
      ]
    }
  },
  error: ''
})

onMounted(async () => {
  if (postId) {
    const resp = await fetch(`http://public.flexink.com:9250/api/public/bbs/post/${postId}`, {
      headers: {
        accept: 'application/json'
      }
    })

    if (resp.ok) {
      const json = await resp.json()
      postDetails.error = ''
      postDetails.post = json
      title.value = postDetails.post.title
      content.value = postDetails.post.content
    } else {
      postDetails.error = "Failed to fetch post."
    }
  }else{
    title.value = ''
    content.value = ''
  }
})

const uploadImage = async () => {
  console.log('initiate file upload...');
  
  let imageInput = document.querySelector("#image") as HTMLFormElement
  
  let imageData = new FormData()

  imageData.append('file', imageInput.files[0]);

  await fetch('http://public.flexink.com:9250/api/public/bbs/post/file', {
    method: 'POST',
    body: imageData
  })
    .then((response) => response.json())
    .then((result) => {
      // console.log(JSON.stringify(result));
      
      // uploadResp[0].filename = result[0].filename
      // uploadResp[0].originalFilename = result[0].originalFilename
      // uploadResp[0].filename = result[0].filename
      // uploadResp[0].filename = result[0].filename
      uploadResp = result
      // uploadResp.push(result)
    })
    .catch((error) => {
      console.error('Upload error:', error);
      error = true
    });
}
const deleteNewImage = async (name:string) => {
  let deleted = false
  await fetch(`http://public.flexink.com:9250/api/public/bbs/post/file/${name}`, {
    method: 'DELETE',
  })
  .then((response) => {
    if (response.ok) {
      alert('File Deleted !')
      deleted = true
    }
  })
  .catch((error) => {
    console.error('Delete error: ', error);
  });

  if (deleted) {
    uploadResp[0].filename = ''
    uploadResp[0].originalFilename = ''
    let imageInput = document.querySelector("#image") as HTMLFormElement

    imageInput.value = ''
  }
}
const deleteExistingImage = async (path:string) => {
  let deleted = false
  await fetch(`http://public.flexink.com:9250/api/public/bbs/post/file/${path}`, {
    method: 'DELETE'
  })
    .then((response) => {
      if (response.ok) {
        alert('File Deleted !')
        deleted = true
      }
    })
    .catch((error) => {
      console.error('Delete error: ', error);
    });

  if (deleted) {
    const fileId = parseInt(path.split('/')[2])
    console.log(fileId);
    
    postDetails.post.attachedFile.attachedFileInfos.filter(file  => file.id !== fileId);  
    router.go(0)
  }
}

const registerBBS = async () => {
  let form = document.querySelector("#inputForm") as HTMLFormElement
  let formData = new FormData(form)
  let registered = false
  const data = {
    title: '',
    content: '',
    attachedFile: {
      attachedFileInfos: [{}]
    }
  }
  for (let [key, val] of formData.entries()) {
    Object.assign(data, { [key]: val })
  }
  data.attachedFile.attachedFileInfos = uploadResp
  console.log("Complete Payload: ", JSON.stringify(data));

    await fetch(`http://public.flexink.com:9250/api/public/bbs/post`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then((response) => {
      if (response.ok) {
        alert('Post registered !')
        registered = true
      }
    })
    .catch((error) => {
      console.error('Register error: ', error);
    });

  if (registered) {
    router.push(`/bbs/list`)
  }
}

const updateBBS = async () => {
  let form = document.querySelector("#inputForm") as HTMLFormElement
  let formData = new FormData(form)
  let updated = false
  const data = {
    title: '',
    content: '',
    attachedFile: {
      attachedFileInfos: [{}]
    }
  }
  for (let [key, val] of formData.entries()) {
    Object.assign(data, { [key]: val })
  }
  data.attachedFile.attachedFileInfos = uploadResp
  console.log("Complete Payload: ", JSON.stringify(data));

  await fetch(`http://public.flexink.com:9250/api/public/bbs/post/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (response.ok) {
        alert('Post updated !')
        updated = true
      }
    })
    .catch((error) => {
      console.error('Update error: ', error);
    });

  if (updated) {
    router.go(0)
  }
}

const deleteBBS = async () => {
  let deleted = false
  await fetch(`http://public.flexink.com:9250/api/public/bbs/post/${postId}`, {
    method: 'DELETE'
  })
    .then((response) =>
    {
      if (response.ok) {
        alert('Deleted !')
        deleted = true
      }
    })
    .catch((error) => {
      console.error('Delete error: ', error);
    });

    if (deleted) {
      router.push(`/bbs/list`)
    } 
}
</script>