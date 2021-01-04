<template>
  <div class="image-upload">
    <div class="imgHeader" v-for="(img,index) in previewImages" :key="index">
      <i v-if="pageAction === 'info'" class="ifont"></i>
      <i v-if="pageAction === 'edit'" @click="detailImg(index)" class="el-icon-close ifont"></i>
      <img
        :src="img"
        alt="未获取到图片"
        :width="width"
        :height="height"
        @click="replaceImg(index)"
      />
      <!-- <p v-if="!index">未获取到图片</p> -->
    </div>

    <label
      v-if="previewImages.length < limit && mode !== 'viewImg'"
      :for="name+ 'uploader'"
      :style="'width: '+width+'; height: '+height+';'"
    >
      <i class="el-icon-plus"></i>
    </label>
    <input
      :accept="accept"
      :multiple="multiple"
      type="file"
      :id="name+'uploader'"
      hidden
      class="upfile"
      @change="handleFileChange"
    />
  </div>
</template>
<script>
export default {
  props: [
    "name",
    "uploaderMode",
    
    "externalPreviewImages",
    "limit",
    "accept",
    "uploadUrl",
    "success",
    "width",
    "height",
    "pageAction2"
  ],
  data() {
    return {
      files: [],
      previewImages: this.externalPreviewImages || [],
      replaceIndex: -1,
      uploadedCount: 0,
      replacedImg: new Array(this.externalPreviewImages.length),
      uploadRes: []
    };
  },
  computed: {
    mode() {
      return this.uploaderMode;
    },
    pageAction() {
      let action = this.$route.path.split("/").pop();
      if (action === "store") {
        return this.pageAction2;
      } else {
        return action;
      }
    }
  },
  watch: {
    externalPreviewImages() {
      if (this.mode === "upload") {
        return;
      }
      this.previewImages = this.externalPreviewImages || [];
      // this.files = []
    }
  },
  methods: {
    addFile(file) {
      console.log(file)
      console.log(this.accept)
      const isLt200k = file.size / 1024 < 200;
      if (this.accept && !file.type.match(this.accept.split("/")[0])) {
        throw Error("from imageUpload：“文件格式不正确”");
      }
      new Promise((resolve, reject) => {
        var form = new FormData();
        var newfile = {};
        if (!isLt200k) {
          const that = this;
          this.photoCompress(
            file,
            {
              quality: 0.1
            },
            function(base64Codes) {
              var bl = that.convertBase64UrlToBlob(base64Codes);
              if (!(bl.size / 1024 < 200)) {
                that.$message.error("上传图片大小不能超过 200KB!");
                return isLt200k;
              }
              form.append("file", bl); // 文件对象
              //上传
              file = bl;
              if (that.replaceIndex !== -1) {
                that.files.splice(that.replaceIndex, 1, file);
                that.previewImages.splice(
                  that.replaceIndex,
                  1,
                  window.URL.createObjectURL(file)
                );
                that.replacedImg[that.replaceIndex] = true;
                that.replaceIndex = -1;
              } else if (that.files.length < that.limit) {
                that.files.push(file);
                that.previewImages.push(window.URL.createObjectURL(file));
              }
            }
          );
        } else {
          form.append("file", file);
          //上传
          if (this.replaceIndex !== -1) {
            this.files.splice(this.replaceIndex, 1, file);
            this.previewImages.splice(
              this.replaceIndex,
              1,
              window.URL.createObjectURL(file)
            );
            this.replacedImg[this.replaceIndex] = true;
            this.replaceIndex = -1;
          } else if (this.files.length < this.limit) {
            this.files.push(file);
            this.previewImages.push(window.URL.createObjectURL(file));
          }
        }
      });
      let upArr = document.querySelectorAll(".upfile");
      upArr.forEach(el => {
        el.value = "";
      });
    },
    photoCompress(file, objCompressed, objDiv) {
      var ready = new FileReader();
      ready.readAsDataURL(file);
      let that = this;
      ready.onload = function() {
        var fileResult = this.result;
        that.canvasDataURL(fileResult, objCompressed, objDiv);
      };
    },

    canvasDataURL(path, objCompressed, callback) {
      var img = new Image();
      img.src = path;
      img.onload = function() {
        var that = this;
        //默认压缩后图片规格
        var quality = 0.5;
        var w = that.width;
        var h = that.height;
        var scale = w / h;
        //实际要求
        w = objCompressed.width || w;
        h = objCompressed.height || w / scale;
        if (
          objCompressed.quality &&
          objCompressed.quality > 0 &&
          objCompressed.quality <= 1
        ) {
          quality = objCompressed.quality;
        }

        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);

        var base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback(base64);
      };
    },

    convertBase64UrlToBlob(urlData) {
      var arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    handleFileChange(e) {
      let files = e.target.files;
      for (let file of files) {
        this.addFile(file);
      }
    },
    replaceImg(index) {
      if (this.mode === "viewImg") {
        return;
      }
      this.replaceIndex = index;
      document.querySelector("#" + this.name + "uploader").click();
    },
    upload() {
      console.log("uploaduploaduploaduploaduploaduploaduploaduploaduploaduploaduploadupload")
      console.log(this.$GETIMGHOST)
      // reset uploaded result
      this.uploadedCount = 0;
      this.uploadRes = new Array(this.files.length);
      if (!this.uploadUrl) {
        throw new Error("from imageUpload：缺少uploadUrl");
      }
      console.log(this.files)
      if (!this.files.length) {
        //没有文件要上传返回空
        let result = []
        // for (let index = 0; index < this.previewImages.length; index++) {
        //   const element = this.previewImages[index];
        //   result[index] = element.replace(this.$GETIMGHOST,'');
        // }

        this.success(result);
        return
      }
      for (let i = 0; i < this.files.length; i++) {
        let file = this.files[i];
        let uploadReader = new FileReader();
        uploadReader.onload = loadedEvent => {
          let xhr = new XMLHttpRequest();
          xhr.open("POST", this.uploadUrl);
          xhr.setRequestHeader("Content-type", file.type.split("/")[1]);
          xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
              if (xhr.readyState === 4 && xhr.status === 200) {
                // 304未修改
                let imageRes = JSON.parse(xhr.responseText);
                if (imageRes.ret) {
                  this.uploadRes[i] = imageRes.info.md5;
                } else {
                  this.uploadRes[i] = "";
                  this.$message.error(
                    "第" + (i + 1) + "张图片上传失败：" + imageRes.error.message
                  );
                }
                this.uploadedCount++;
                if (this.uploadedCount === this.uploadRes.length) {
                  let res = new Array(this.replacedImg.length);
                  if (this.mode === "replace") {
                    for (
                      var k = 0, j = 0;
                      k < this.replacedImg.length && j < this.uploadRes.length;
                      k++
                    ) {
                      if (this.replacedImg[k]) {
                        res[k] = this.uploadRes[j];
                        j++;
                      } else {
                        //未被替换，赋空，需要外界处理
                        res[k] = "";
                      }
                    }
                    if (j < this.uploadRes.length) {
                      //说明是新增加的图片
                      res = res.concat(this.uploadRes.slice(j));
                    }
                  } else {
                    res = this.uploadRes;
                  }
                  this.success(res);
                }
              } else if (xhr.status !== 200 && xhr.status !== 304) {
                throw new Error("from imageUpload: 上传图片失败");
              }
            }
          };
          // 进度条，待完善
          //            xhr.upload.onprogress = (event) => {
          //              let progress = Math.floor((event.loaded / event.total) * 100)
          //              console.log(progress + '%')
          //            }
          xhr.send(loadedEvent.target.result);
        };
        uploadReader.readAsArrayBuffer(file);
      }
    },
    detailImg(index) {
      // console.log('edit')
      this.previewImages.splice(index, 1);
    },
    reset() {
      this.files.splice(0);
      this.previewImages.splice(0);
      this.uploadRes.splice(0);
      this.uploadedCount = 0;
    }
  }
};
</script>
<style scoped>
.image-upload {
  display: -webkit-box;
}

.image-upload img {
  margin-right: 10px;
}

.image-upload label {
  display: block;
  font-size: 20px;
  color: #8c939d;
  line-height: 100px;
  text-align: center;
  border: 1.8px dashed #cccccc;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.image-upload label:hover {
  border-color: #409eff;
}
.imgHeader {
  position: relative;
}
.ifont {
  position: absolute;
  right: 0;
  top: 7px;
  left: 76px;
  color: #333;
  font-size: 20px;
}
</style>
