<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-centered">
          <div class="column is-3-tablet is-2-desktop is-5-widescreen">
            <div class="field has-text-centered">
              <div class="label">
                <div class="is-size-3 is-capitalized">Youtube Video Downloader</div>
              </div>
            </div>
            <div class="container is-flex">
              <div class="field has-addons">
                <div class="control">
                  <input type="text" class="input is-info is-large" 
                    placeholder="Enter Url to Download" 
                    v-model="inputUrl"
                  >
                </div>
                <div class="control">
                    <a class="button is-info is-large" @click="download()">Download</a>
                </div>
              </div>
            </div>
            <hr/>
            <div class="field has-text-centered">
              <span class="is-size-3 is-capitalized">Downloaded: {{ downloadedPerc }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';
import io from 'socket.io-client';
import PostServices from '@/services/PostServices';
import { useToast } from 'vue-toastification';
const FileDownload = require("js-file-download");


const socket = io('http://localhost:8081/',  { transports : ['websocket'] });

export default defineComponent({
  name: 'Home',
  components: {
  },
  setup() {
    const toast = useToast();
    const state = reactive({
      inputUrl: '',
      downloadedPerc: 0,
    });
    const download = async () => {
      if (!state.inputUrl) return toast.error('Please enter validurl');
      try {
        await PostServices.addNew({
          youtubeUrl: state.inputUrl,
        });
      } catch (e) {
        console.error('error', e);
      }
    }
    socket.on('progress', (data) => {
      state.downloadedPerc = data.progress;
    })
    socket.on('videoDone', (data) => {
      state.downloadedPerc = data.progress;
      PostServices.getVideo({
        fileName: data.fileLocation
      }).then((res) => {
        const csvFile = new Blob([res.data]);
        FileDownload(csvFile, `${data.fileLocation}.mp4`);
        state.inputUrl = '';
        state.downloadedPerc = 0;
      })
    })
    return {
      download,
      ...toRefs(state),
    }
  }
});
</script>
