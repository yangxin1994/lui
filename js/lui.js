
;(function(global,undefined){
    "use strict";
    /**
       * 闭包使用g作为命名空间
       * @namespace g
     */
    var g = {};
    /**
      返回文档中匹配指定 CSS 选择器的一个元素
      * @method selector
      * @memberof  g
    */
    g.selector = function(el){
      return document.querySelector(el);
    }
    /**
      返回文档中匹配指定 CSS 选择器的集合
      *  @method selectorAll()
      *  @memberof  g
    */
    g.selectorAll = function(el){
      return document.querySelectorAll(el);
    }
    /**
      * 判断是否支持touch事件
    */
    g.isSupportTouch = function(){
        return 'ontouchstart' in window
    }
   /**
    * 长按事件
    * @param  {string}   el [选择器]
    * @param  {Function} cb [回调函数]
    */
    g.longPress = function(el,cb){
        var t = null,selector = g.selector(el);
        var handleStart = g.isSupportTouch() ? 'touchstart' : 'mousedown',
            handleEnd = g.isSupportTouch() ? 'touchend' : 'mouseup';
        selector.addEventListener('contextmenu', function(e){
          e.preventDefault();
        });
        selector.addEventListener(handleStart,function(e){
            selector.style.cssText += '-webkit-touch-callout:none';
            e.preventDefault();
            t = setTimeout(function(){
              if (cb && typeof cb == 'function') {
                cb();
              }
            },800)
        },false)
        selector.addEventListener(handleEnd,function(){
            clearTimeout(t);
        },false)
    }
    /**
     * 动态加载js
     * @param url 传入的url,单个直接是字符串形式，多个以数组形式
     * @param callback 加载js后的回调
    */
     g.loadScript = function(url, callback) {
      var script;
      if(typeof url == 'string'){
        script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.defer = true;
        script.src = url;
        document.body.appendChild(script);
      }else{
        for(var i = 0;i < url.length;i ++){
          script = document.createElement("script");
          script.type = "text/javascript";
          script.async = true;
          script.defer = true;
          script.src = url[i];
          document.body.appendChild(script);
        }
      }
      if(callback && typeof callback == 'function'){
        if (script.readyState) {
            script.onreadystatechange = function () {
              if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
              }
            };
          } else {
            script.onload = function () {
              callback();
            };
          }
      }
    }
    g.pullDownRefresh = function(container,callback){
        var touch,startX,startY,moveX,moveY,touchX,touchY,flag = false;
        var div = document.querySelector(container),
          iconHeight = 50;
         div.style.cssText += 'transform:translate3d(0,-'+iconHeight+'px,0);webkitTransform:translate3d(0,-'+iconHeight+'px,0);overscroll-behavior: contain';

        div.addEventListener("touchstart",touchstart,false);
        div.addEventListener("touchmove",touchmove,false);
        div.addEventListener("touchend",touchend,false);

        function touchstart(e){
            flag = true;
            // e.preventDefault();
            var touch = e.changedTouches[0];
            startX = touch.pageX;
            startY = touch.pageY;
            // console.log('touchstart:'+startX);
        }

        function touchmove(e){
            var touch = e.changedTouches[0];
            moveX = touch.pageX;
            moveY = touch.pageY;
            touchX = moveX - startX;
            touchY = moveY - startY - iconHeight;
            if (moveY - startY > 0 && flag){
              if (touchY > 6) {
                document.querySelector('#pullDown').classList.add('flip');
              }else{
                document.querySelector('#pullDown').classList.remove('flip');
              }
              div.style.cssText += 'transform:translate3d(0,'+touchY+'px,0);webkitTransform:translate3d(0,'+touchY+'px,0);';
            }
            // console.log('touchY:'+touchY);
        }

        function touchend(e){
            flag = false;
            div.style.cssText += 'transform:translate3d(0,-'+iconHeight+'px,0);webkitTransform:translate3d(0,-'+iconHeight+'px,0);transition:all .2s cubic-bezier(.08,.87,.08,.87);webkitTransition:all .2s cubic-bezier(.08,.87,.08,.87);';
            if (callback && typeof callback === "object" && callback['end']) {
                callback['end'](touchY)
            };
        }
    },
    /**
      * 滑动到底加载更多（需要注意的是，有滚动条才能滚动，如果页面禁止了默认滑动，也无法使用该方法）
      * @param wrap要滚动的元素
      * @param callback滚动到底的回调函数
    */
    g.scrollLoadData =function(wrap,callback){
      var wrap = document.querySelector(wrap),
         divHeight = wrap.clientHeight,
         scrollTop, 
         scrollHeight,
         t = null,
         res;
      wrap.onscroll = function(){
        scrollHeight = this.scrollHeight;
        scrollTop = this.scrollTop;
        if(scrollTop + divHeight >= scrollHeight){
          if(callback && typeof callback === "function"){
              clearTimeout(t);
              t = setTimeout(function(){
                  callback();
              },100)
          }
        }else{
            res = divHeight+'+'+scrollTop +'>'+ scrollHeight+'?';
            // console.log(res);          
        }
      };
    }
    /**
      * tab切换
      * @params tabs 包含tab和tabContent的外层div
    */
    g.tab = function(tabs){
      var tabs = document.querySelector(tabs),
        tab = tabs.querySelectorAll('[tab-role="tab"]'),
        tabContent = tabs.querySelectorAll('[tab-role="tabContent"]');
      tabs.addEventListener('click',function(e){
        for(var i =0,len = tab.length;i < len;i++){
          tab[i].setAttribute('data-id',i);
          var index = e.target.dataset.id;
          if(index == i){
            tab[i].classList.add('active');
            tabContent[i].style.display = 'block'
          }else{
            tab[i].classList.remove('active');
            tabContent[i].style.display = 'none';
          }
        }
      },true)
    }
    /**
        *输入框高度自适应
        *@param textarea 要绑定的textarea
        *@param num 克隆的textarea的随机id(用于一个页面有多个textarea的情况)
    */
    g.autoTextarea = function(textarea,num){
        var textarea = document.querySelector(textarea),
            node = textarea.cloneNode(),
            num = num || 0;
        node.id = 'clone_textarea2017'+num;
       document.querySelector('body').appendChild(node);
       node.style.cssText = 'position:absolute;left:-1000000px';
       textarea.oninput = function(e){
          console.log('input');
           node.value = textarea.value;
           node.style.cssText += 'width:'+textarea.scrollWidth+'px';
           var h = node.scrollHeight;
           h=h>70?70:(h>35 ? h+2 : 30);
           e.target.style.cssText = 'height:'+h+'px';
       }
    }
    /**
      * 计算文本域输入字数
      * @param textField 要绑定的文本域
      * @param cb 监听输入后的回调
    */
    g.computeTextField = function(textField,cb){
        var el = g.selector(textField);
        el.oninput = function(e){
          var res = e.target.value;
          if (cb && typeof cb == 'function') {
              cb(res.length);
          }
        }
    }
    /**
      *搜索交互
      @param opts 接收一个对象参数 
    */
    g.searchControl = function(opts){
      var opts = opts || {
        el:el,  //绑定搜索框外层元素
        input:function(){ //实时输入的回调
        },
        clear:function(){ //清空搜索框输入值的回调
        },
        cancel:function(){  //取消搜索的回调
        },
        enter:function(){ //回车事件回调
        }
      }
      var el = opts.el,
          input = opts.input,
          clear = opts.clear,
          cancel = opts.cancel;
          enter = opts.enter;
      var labelEl = g.selector(el).querySelector('[role="search-label"]'),
          inputEl = g.selector(el).querySelector('[role="search-input"]'),
          closeEl = g.selector(el).querySelector('[role="search-close"]'),
          cancelEl = g.selector(el).querySelector('[role="search-cancel"]');
        //展开搜索框
        var _showSearch = function(){
            labelEl.style.display = 'none';
        };
        //显示删除按钮
        var _showClose = function(){
            var val = inputEl.value;
            if(val.length){
                closeEl.style.display = 'block';
                if (input && typeof input === "function") {
                    input(val)
                }
            }else{
                closeEl.style.display = 'none';
            }
        };
        //清除输入框值
        var _clearValue = function(){
            inputEl.value = '';
            closeEl.style.display = 'none';
            if (clear && typeof clear === "function") {
                clear()
            }
        };
        //取消搜索
        var _cancelSearch = function(){
            _clearValue();
            labelEl.style.display = 'block';
            if (cancel && typeof cancel === "function") {
                cancel()
            }
        };
        //回车
        inputEl.onkeypress = function(e){
            var keyCode = e.which || e.keyCode;
            var val = e.target.value;
            if(keyCode == 13){
                if(enter && typeof enter === "function"){
                    enter(val)
                }
            }
          }
        labelEl.addEventListener('click',_showSearch,false);
        inputEl.addEventListener('input',_showClose,false);
        closeEl.addEventListener('click',_clearValue,false);
        cancelEl.addEventListener('click',_cancelSearch,false);
    }
     /**
        *底部弹出层
        @param el 弹窗页面的选择器
        @param callback 回调方法
     */
    g.viewModal = function(el,callback){
      var t = null,el = document.querySelector(el);
        if(!(el.className.indexOf('isOpenModal') > -1)){
        clearTimeout(t);
            el.classList.add('isOpenModal');
        if(document.querySelector('[data-role="main-page"]')){
          document.querySelector('[data-role="main-page"]').style.display = 'none';
        }
        el.style.display = 'block';
        setTimeout(function(){
          el.classList.remove('modal_out');
          el.classList.add('modal_in');
        },10)
          if (callback && typeof callback === "object" && callback['open']) {
            callback['open']();
          };
        }else {
        el.classList.remove('isOpenModal');
        if(document.querySelector('[data-role="main-page"]')){
          document.querySelector('[data-role="main-page"]').style.display = 'block';
        }
        el.classList.remove('modal_in');
        el.classList.add('modal_out');
          t = setTimeout(function(){
              el.style.display = 'none';
          },300)
          if (callback && typeof callback  === "object" && callback['close']) {
              callback['close']();
          };
        }
    }
    /**
         * loading
         * @param text 提示内容，如果传入参数为close，则关闭loading
         * @param opacity 遮罩透明度
     */
    g.loading = function(text,opacity) {
        var text = text || "加载中...";
        var maskEl = document.getElementById('j_loading_mask');
        if (maskEl) {
          maskEl.parentNode.removeChild(maskEl);
        }
       if (text != 'close'){
         var el = document.createElement('div');
            el.id = 'j_loading_mask';
            el.className = 'ui_loading_mask';
            el.style.cssText = 'background:rgba(0,0,0,'+opacity+')';
            el.innerHTML =  '<div class="ui_loading_wrap" id="ui_loading_wrap">'
                    +            '<div id="loading" class="ui_loading"><div><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>'
                    +            '</div>'
                    +            '<div class="ui_loading_text">'
                    +                '<p>'+text+'</p>'
                    +           '</div>'
                    +    '</div>';
        document.body.appendChild(el);
       } else {
        var childEl = document.getElementById('j_loading_mask');
        if (childEl) {
          childEl.parentNode.removeChild(childEl);
        }
      }
    }
     /**
         * toast (opts接受一个对象参数）
         * @param type 操作提示类型
         * @param text 提示文本内容
         * @param duration 持续多少毫秒退出
         * @param position 所在页面位置
     */
    g.toast = function(opts) {
        var opts = opts || {};
        opts.type = opts.type || 'ok';
        opts.text = opts.text || '提示信息';
        opts.position = opts.position || '';
        opts.duration = opts.duration || 2000;
       var el = document.createElement('div');
          el.id = 'js_ui_toast';
          el.className = 'ui_toast_wrap';
          el.innerHTML =  '<div class="ui_toast toast_'+opts.position+'">'
                  +           '<div class="ui_toast_inner">'
                    +            '<span class="ui_toast_ico_wrap"><i class="ui_toast_ico ui_toast_'+opts.type+'_ico"></i></span>'
                    +            '<div class="ui_toast_text">'
                    +                '<p>'+opts.text+'</p>'
                    +             '</div>'
                  +           '</div>'
                  +    '</div>';
        document.body.appendChild(el);
        setTimeout(function(){
          var childEl = document.getElementById('js_ui_toast');
          if (childEl) {
            childEl.parentNode.removeChild(childEl);
          }
        },opts.duration)
    }
    /**
      * showModal模态框  (opts 接收一个对象参数 )
      * @param title 标题
      * @param content 内容
      * @param cancelText 取消按钮的文字
      * @param confirmText 确认按钮的文字
      * @param skin 自定义class样式
      * @param showCancel 是否显示取消按钮，默认为 true
      * @param cancel {function} 取消按钮的回调函数
      * @param confirm {function}  确定按钮的回调函数
      * @param beforeHide {function}  退出模态框前的回调函数
    */
    g.showModal = function(opts){
      var opts = opts || {}
      opts.title = opts.title || '提示';
      opts.content = opts.content || '内容';
      opts.cancelText = opts.cancelText || '取消';
      opts.confirmText = opts.confirmText || '确认';
      opts.skin = opts.skin || '';
      opts.showCancel = opts.showCancel || false;
      var modalEl = document.querySelector('#j_modal_wrap');
      if (modalEl) {
          modalEl.parentNode.removeChild(modalEl); //避免出现多个弹窗
      }
      var el = document.createElement('div');
          el.id = 'j_modal_wrap';
          el.className = 'ui_modal_wrap';
          el.innerHTML =  '<div class="ui_modal '+opts.skin+'" id="j_modal">'
                    +          '<div class="ui_modal_hd">'+opts.title+'</div>'
                    +          '<div class="ui_modal_bd">'+opts.content+'</div>'
                    +          '<div class="ui_modal_ft" id="js_btns2017">'
                    +             '<a href="javascript:;" class="ui_modal_btn ui_modal_default_btn" data-btn="_cancel2017">'+opts.cancelText+'</a>'
                    +             '<a href="javascript:;" class="ui_modal_btn ui_modal_primary_btn" data-btn="_confirm2017">'+opts.confirmText+'</a>'
                    +           '</div>'
                    +    '</div>';
        document.body.appendChild(el);
        var cancelBtn = g.selector('[data-btn="_cancel2017"]'),
            confirmBtn = g.selector('[data-btn="_confirm2017"]');
        !opts.showCancel &&  cancelBtn.parentNode.removeChild(cancelBtn);
        var modal_wrap = document.querySelector('#j_modal_wrap'),
            modal = document.querySelector('#j_modal');
        setTimeout(function(){
           modal.classList.add('ui_modal_in');
        },60)
       var hideModal = function(){
            modal.classList.remove('ui_modal_in');
            modal.classList.add('ui_modal_out');
            if (opts.beforeHide && typeof opts.beforeHide == 'function') {
              opts.beforeHide()
            }
            setTimeout(function(){
              modal_wrap.parentNode.removeChild(modal_wrap);
            },200)
       }

       var ModalbtnHandle = function(e){
        var  btn = e.target.dataset.btn;
          if (btn) {
              if(btn == "_cancel2017" && opts.cancel && typeof opts.cancel == "function"){
                  setTimeout(function(){
                    opts.cancel();
                  },201)
              }
              if(btn == "_confirm2017" && opts.confirm && typeof opts.confirm == "function") {
                  setTimeout(function(){
                    opts.confirm();
                  },201)
              }
              hideModal();
          };
      }
      cancelBtn && cancelBtn.addEventListener('click',function(e){
        ModalbtnHandle(e);
      },false);
      confirmBtn && confirmBtn.addEventListener('click',function(e){
        ModalbtnHandle(e);
      },false);
    }
    /**
     * ajax封装(使用方法与jq的ajax方法几乎一样)
     */
    g.request = function(opts) {
        var opts = opts || {};
        opts.type = opts.type.toUpperCase() || 'POST';
        opts.url = opts.url || '';
        opts.data = opts.data || null;
        opts.beforeSend = opts.beforeSend || function() {};
        opts.success = opts.success || function() {};
        opts.error = opts.error || function() {};
        opts.closeLoading = opts.closeLoading || false
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
            xmlhttp = new XMLHttpRequest();
        } else {
            // IE6, IE5 浏览器执行代码
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var params = [];
        for (var key in opts.data) {
            params.push(key + '=' + opts.data[key]);
        }
        var postData = params.join('&');
        opts.beforeSend();
        if (opts.type === 'POST') {
            xmlhttp.open(opts.type, opts.url, true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send(postData);
        } else if (opts.type === 'GET') {
            xmlhttp.open(opts.type, opts.url + '?' + postData, true);
            xmlhttp.send();
        }
        if (! opts.closeLoading) {
            g.loading();
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                g.loading('close');
                var res = JSON.parse(xmlhttp.responseText);
                opts.success(res)
            }
        }
        xmlhttp.onerror = function(e){
          opts.error(e)
        }
    }
    /**
      索引列表滑动
    */
    g.touchIndex = function(){
        var startX, startY, moveX, moveY, title, a, y = [],h = [],english,word_popup,t = null,flag = false;
        title = document.querySelectorAll('[data-role="word_index"]');
        english = document.querySelector('[data-role="word_list"]');
        a = document.querySelectorAll('[data-role="word_list"] a');
        word_popup = document.querySelector('[data-role="word_popup"]'); //popup
        var fixed_h = (document.body.clientHeight - english.clientHeight) / 2; //原生js的offsetTop在元素用了fixed属性后，有bug，会从0计算，所以用窗口的高度减去元素的高度来计算距离
        // console.log((fixed_h));
        for (var i = 0; i < a.length; i++) {
            a[i].addEventListener('touchstart', _start, false);
            a[i].addEventListener('touchmove', _move, false);
            a[i].addEventListener('touchend', _end, false);
            y[i] = a[i].offsetTop + fixed_h;
            h[i] = a[i].clientHeight;
        };

        function _start(e) {
            flag = true;
            var touch = e.changedTouches[0];
            startX = touch.pageX;
            startY = touch.pageY,
            href_split = e.target.getAttribute('href').split('#')[1];
            word_popup.classList.add('active');
            word_popup.innerText = href_split;
        }
        function _move(e) {
            e.preventDefault();
            if (flag) {
              var touch = e.changedTouches[0];
              moveX = touch.pageX;
              moveY = touch.pageY;
              word_popup.classList.add('active');
              var scrollTop = document.body.scrollTop;
              for (var j = 0; j < title.length; j++) { //循环需要滑动的英文字母
                  if ((y[j] + scrollTop < moveY) && (moveY < y[j] + h[j] + scrollTop)) { //计算区间获得对应字母的位置
                      window.location.hash = title[j].id;
                      word_popup.innerText = title[j].id;
                  }
              };
            }
        }
        function _end() {
          flag = false;
          clearTimeout(t);
          t = setTimeout(function(){
            word_popup.classList.remove('active');
          },500);
        }
    }
    /**
      * 水印(增加密度)
      * @param div 将水印挂载到指定div
      * @param str 水印文字
      * @param len 水印个数
    */
    g.watermark = function(div,str,len){
      var str = str || '保密水印';
      var el,top,left,translateX,len = len || 10,container = document.querySelector(div);
      container.style.cssText += 'position:relative;overflow:hidden;user-select:none;-webkit-user-select:none;'
      for (var i = 0; i < len; i++) {
        top = 19*i-40;
        if(i%5 == 0){
          left = '10%';
        }
        if(i%5 == 1){
          left = '30%';
        }
        if(i%5 == 2){
          left = '50%';
        }
        if(i%5 == 3){
          left = '70%';
        }
        if(i%5 == 4){
          left = '90%';
        }
        translateX = '-50%';
        el = document.createElement('div');
        el.className = 'fixed_watermark';
        el.style.cssText = 'pointer-events:none;position:absolute;transform:rotate(-25deg) translateX('+translateX+');-webkit-transform:rotate(-25deg) translateX('+translateX+');font-size:16px;color:#bcc7cd;opacity:.5;user:none;-webkit-user:none;white-space:nowrap';
        el.innerHTML = str;
        el.style.cssText += 'left:'+left+';top:'+top+'px;';
        if(container){
          container.appendChild(el);
        }else{
          document.body.appendChild(el);
        }
      }
    }
    /**
      * 详情图片预览
      * @param img 图片选择器集合
    */
    g.photoZoom = function(img){
        var arr = document.querySelectorAll(img),
            slide = '',
            _this = this;

        var i,len = arr.length,str ='',div;
        div = document.createElement('div');
        div.id = 'js_photoZoomWrap';
        div.className = 'photoZoomWrap';
        var init = function(){
              str +='<div class="swiper-container photoZoom modal_out" id="swiperZoom">'
                      str += '<div class="swiper-wrapper">'
                     for (i = 0; i < len; i++) {
                      str +=   '<div class="swiper-slide">'
                      str +=         '<div class="swiper-zoom-container">'
                      str +=            '<img src="'+arr[i].src+'" class="swiper-lazy">'
                      str +=       '</div>'
                      str +=    '</div>';
                     }
                      str +='</div>'
                      str +='<div class="swiper-pagination swiper-pagination-white"></div>'
                      str +=  '<div class="swiper-button-prev"></div>'
                      str +=  '<div class="swiper-button-next"></div>'
                      str +='<div class="close_photoZoom" id="close_photoZoom"></div>'
                 str +='</div>';
            div.innerHTML = str;
            document.body.appendChild(div);
        }();
          var swiper = new Swiper('#swiperZoom', {
            zoom: true,
            pagination: {
              el: '.swiper-pagination',
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
            on:{
              click: function(event){
                closePhotoZoom();
              }
            }
        });
        //关闭
        var closePhotoZoom = function(){
            g.selector('#swiperZoom').classList.remove('modal_in');
            g.selector('#swiperZoom').classList.add('modal_out');
            setTimeout(function(){
              g.selector('#js_photoZoomWrap').classList.remove('active');
            },200)
        }
        document.addEventListener('click',function(e){
          if (e.target.id == 'close_photoZoom') {
              closePhotoZoom();
          }
        },false)
        //预览当前
        for (var i = 0; i < arr.length; i++) {
            (function(index){
                arr[index].addEventListener('click',function(){
                    swiper.slideTo(index,0);
                    g.selector('#js_photoZoomWrap').classList.add('active');
                    g.selector('#swiperZoom').classList.remove('modal_out');
                    g.selector('#swiperZoom').classList.add('modal_in');
                },false)
            })(i)
        };
    }

    /**
      *上传图片预览大图
      * @param img 图片选择器集合
      * @param index 当前图片预览的索引
    */
    g.photoZoomUpload = function(img,index){
        var arr = document.querySelectorAll(img),
            slide = '',
            _this = this;
      var i,len = arr.length,str ='',div;
        div = document.createElement('div');
        div.id = 'js_photoZoomUploadWrap';
        div.className = 'photoZoomWrap';
        var init = function(){
            str += '<div class="swiper-container photoZoom modal_out" id="swiperZoomUpload">'
                str += '<div class="swiper-wrapper">'
                for (i = 0; i < len; i++) {
                 str += '<div class="swiper-slide">'
                 str +=         '<div class="swiper-zoom-container">'
                 str +=            '<img src="'+arr[i].src+'" class="swiper-lazy">'
                 str +=        '</div>'
                 str +=    '</div>';
          }
                 str +='</div>'
                 str +='<div class="swiper-pagination swiper-pagination-white"></div>'
                 str +='<div class="swiper-button-prev"></div>'
                 str +='<div class="swiper-button-next"></div>'
                str +='<div class="close_photoZoom" id="close_photoZoomUpload"></div>'
             str +='</div>';
            div.innerHTML = str;
            document.body.appendChild(div);
        }();

          var swiper = new Swiper('#swiperZoomUpload', {
              zoom: true,
              initialSlide:index,
              pagination: {
                el: '.swiper-pagination',
              },
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              },
              on:{
                click: function(event){
                  closePhotoZoom();
                }
              }
          });
           swiper.pagination.update();
           g.selector('#js_photoZoomUploadWrap').classList.add('active');
           g.selector('#swiperZoomUpload').classList.remove('modal_out')
           g.selector('#swiperZoomUpload').classList.add('modal_in');

          //关闭
          var closePhotoZoom = function(){
            var photoZoomWrap = g.selector('#js_photoZoomUploadWrap');
            photoZoomWrap.parentNode.removeChild(photoZoomWrap)
          }
          document.addEventListener('click',function(e){
            if (e.target.id == 'close_photoZoomUpload') {
              closePhotoZoom();
            }
          },false)
    }
    /**
     * 倒计时
     * @param str 时间字符串
     * @param cb 回调函数
     */
    g.countDown = function(str,cb){
      var s = "";
      var t = setInterval(function(){
        str = str.replace(/-/g,"/");
        var lastDate = new Date(str);
        var currDate = new Date();
        if(lastDate < currDate){           
            clearInterval(t);
            cb();
        }
        var intDiff = (lastDate.getTime()-currDate.getTime())/1000;
        var day=0,
          hour=0,
          minute=0,
          second=0;//时间默认值
        if(intDiff > 0){
          day = Math.floor(intDiff / (60 * 60 * 24));
          hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
          minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
          second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (day < 10) day = '0' + day;
        if (hour < 10) hour = '0' + hour;
        if (minute < 10) minute = '0' + minute;
        if (second < 10) second = '0' + second;
        s = day+"|"+hour+'|'+minute+'|'+second;
        intDiff--;
        cb(s)
      }, 1000);
    }
    /**
     * 获取第几天的时间
     * @param num {Number} 第几天
     * @param datetime {Date} 某天的日期
     * @param type {String} 时间类型
     */
    g.getTime = function(num,datetime,type){
        var datetime = datetime || new Date(),
          d = new Date(datetime);
        d.setTime(d.getTime() + (24*60*60*1000) * num);
        var y = d.getFullYear(),
            M = d.getMonth() + 1,
            _d = d.getDate(),
            h = d.getHours(),
            m = d.getMinutes(),
            s = d.getSeconds();
        if(M<10){M='0'+M}
        if(h<10){h='0'+h}
        if(m<10){m='0'+m}
        if(s<10){s='0'+s}
        if(_d<10){_d='0'+_d}
        if(type == 'datetime'){
            return y + "-" + M + "-" + _d;
        }else{
            return y + "-" + M + "-" + _d + ' '+h+':'+ m +':'+s;
        }        
    },
    /**
     * 返回某天中文星期
     * @param datetime {Date}
     */
    g.getCnDay = function(datetime){    
        var datetime = datetime || new Date();
        var d = new Date(datetime).getDay(),x; 
        switch (d) 
            { 
                case 0:x="日"; 
                break; 
                case 1:x="一"; 
                break; 
                case 2:x="二"; 
                break; 
                case 3:x="三"; 
                break; 
                case 4:x="四"; 
                break; 
                case 5:x="五"; 
                break; 
                case 6:x="六"; 
                break; 
            }
        return x
    }
    global.lui = g;
})(window);
