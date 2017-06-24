import Panel from '@/components/base/Panel'
import Carousel from '@/components/base/Carousel'

let template = 
`
<ms-panel :ref="panel">
  <div slot="panel-bar">
    <ms-carousel :widget="[carousel]" :ref="carousel" />

    <button class="btn" :click="prev">向前</button>
    <button class="btn" :click="next">向后</button>
    <div class="input-prepend input-append" style="margin-top: 10px; display: inline;">
      <span class="add-on">第</span>
      <input class="span1" type="text" :duplex="index">
      <span class="add-on">个</span>
      <button class="btn" :click="to">跳转</button>
    </div>
  </div>
</ms-panel>
`

export default {
  name: 'ms-carousel-panel',
  template,
  data () {
    return {
      carousel: {
        items:[{
          img: 'http://v2.bootcss.com/assets/img/bootstrap-mdo-sfmoma-01.jpg',
          caption: `
            <h4>First Thumbnail label</h4>
            <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. </p>
          `,
          href: '#1'
        }, {
          img: 'http://v2.bootcss.com/assets/img/bootstrap-mdo-sfmoma-02.jpg',
          caption: `
            <h4>Second Thumbnail label</h4>
            <p>Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
          `,
          href: '#2'
        }, {
          img: 'http://v2.bootcss.com/assets/img/bootstrap-mdo-sfmoma-03.jpg',
          caption: `
            <h4>Third Thumbnail label</h4>
            <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
          `,
          href: '#3'
        }],
        interval: 2000
      },
      index: 1
    }
  },
  methods: {
    prev () {
      this.$$ref.carousel.prev()
    },
    next () {
      this.$$ref.carousel.next()
    },
    to () {
      let index = ~~this.index
      this.$$ref.carousel.to(index)
    }
  },
  components: {
    Panel, 
    Carousel
  }
}
