<template>
  <header>
    <nav>
      <h2>This is Header</h2>
    </nav>
  </header>
  <div class="main">
    <div class="sidebar">
      <ul class="menu-list">
        <li v-for="(menu, index) in menuList.menus" :key="index" class="group menu-item">
          {{menu.menuName}}
          <ul class="submenu-list">
            <router-link v-for="(submenu, index) in menu.subMenus" :key="index" :to="`${submenu.url}`">
              <li class="submenu-item">
                <span style="margin-left: 5px;">{{ submenu.menuName }}</span>
              </li>
            </router-link>
          </ul>
        </li>
      </ul>
    </div>
    <div class="content">
      <RouterView :key="$route.fullPath" />
    </div>
  </div>
  <footer>
    <h3>This is footer</h3>
  </footer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted,  } from 'vue';
import { RouterLink, RouterView } from 'vue-router'

let menuOpen = false
const openMenu = () => ({

})

interface menuList {
  menuName: String,
  subMenus: [
    {
      menuName: String,
      url: String
    }
  ]
}

const menuList = reactive({
  menus: Array<menuList>(),
  error: ''
})

onMounted(async () => {
  menuList.menus = []
  const resp = await fetch("http://public.flexink.com:9250/api/public/menu/hierarchy",{
    headers: {
      accept: 'application/json'
    }
  })
  
  // console.log(json);
  if(resp.ok){
    const json = await resp.json()
    menuList.error = ''
    menuList.menus = json
  }else{
    menuList.error = "Failed to fetch menu."
  }
})

</script>

<style>
@import '@/assets/base.css';

#app {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  overflow: hidden;
  font-weight: normal;
}
</style>
