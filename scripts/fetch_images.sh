#!/bin/bash
set -e
cd /home/z/my-project/public
mkdir -p images
dl() {
  curl -sL --retry 2 "$1" -o "$2" && echo "OK $2 $(du -h "$2" | cut -f1)"
}
dl "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/400e3062cdc6.jpg"  images/_hero-aerial.jpg
dl "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b26878756b20.jpg"  images/_paddy-dusk.jpg
dl "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6b97d95e000b.jpg"  images/_paddy-flooded.jpg
dl "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5ad9b6ce014c.jpeg" images/_canal-canoe.jpg
dl "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/60294238fc48.jpg"  images/_flood-village.jpg
dl "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/70180514ad1e.jpeg" images/_flood-church.jpg
dl "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/55f677b5948c.jpg"  images/_backwaters.jpg
echo "--- resizing ---"
cd /home/z/my-project/public/images
for f in _*.jpg _*.jpeg; do
  base=$(echo "$f" | sed 's/^_//; s/\.jpeg$/.jpg/')
  bun -e "const s=require('sharp'); s('$f').resize({width:2000,withoutEnlargement:true}).jpeg({quality:76,mozjpeg:true}).toFile('$base').then(i=>console.log('$base', i.width+'x'+i.height)).catch(e=>console.error(e.message))"
  rm -f "$f"
done
ls -la
