/* Main functions used for FimTale based on Carbon Forum */

//FimTale核心函数库
var FimTale = {
  //当前用户ID
  curUserID: 0,
  //浏览器相关参数
  browser: {
    versions: (function () {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      return {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        weixin: u.indexOf('MicroMessenger') > -1, //是否微信
        kindle: u.indexOf('Kindle') > -1, //是否是Kindle
        qq: u.match(/\sQQ/i) == " qq" //是否QQ
      };
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
  },
  //通用部分
  global: {
    //将组件的rgb字符串转成rgb数组
    transformRGBStringToArray: function (str) {
      var RGBArray = [255, 255, 255, 0];
      if (str !== undefined)
        str.replace(/rgb\((.*)?, (.*)?, (.*)?\)/g, function (a, b, c, d) {
          RGBArray = [parseInt(b), parseInt(c), parseInt(d), 1];
        }).replace(/rgba\((.*)?, (.*)?, (.*)?, (.*)?\)/g, function (a, b, c, d, e) {
          RGBArray = [parseInt(b), parseInt(c), parseInt(d), parseInt(e)];
        });
      return RGBArray;
    },
    //判断两个数组是否相等
    isArrayEqual: function (arr1, arr2) {
      var len1 = arr1.length,
        len2 = arr2.length;
      if (len1 !== len2) return false;
      for (var i = 0; i < len1; i++) {
        if (arr1[i] !== arr2[i]) return false;
      }
      return true;
    },
    //将变量转为布尔代数
    parseBool: function (obj) {
      if (obj === 'false') return false;
      return !!obj;
    },
    //获取日期相关信息
    getDateInfo: function () {
      var da = new Date();
      var y = da.getFullYear(),
        m = da.getMonth() + 1,
        d = da.getDate(),
        h = da.getHours(),
        i = da.getMinutes(),
        s = da.getSeconds();
      var c = function (di) {
        return di < 10 ? '0' + di : di;
      };
      return {
        'timeStamp': da.valueOf(),
        'y': y,
        'm': m,
        'd': d,
        'h': h,
        'i': i,
        's': s,
        'str': FimTale.global.date(window.translate('Year_Month_Day'), da.valueOf()) + " " + c(h) + ':' + c(i) + ":" + c(s)
      };
    },
    date: function (template, d) {
      var l = template.split('');
      if (d == null) {
        d = new Date();
      } else {
        d = new Date(d);
      }
      var c = function (di) {
        return di < 10 ? '0' + di : di;
      }, fl = {
        'u': function () {
          return d.valueOf() / 1000;
        },
        's': function () {
          return c(d.getSeconds())
        },
        'i': function () {
          return c(d.getMinutes())
        },
        'g': function () {
          var hour = d.getHours() % 12;
          if (hour === 0) hour = 12;
          return hour;
        },
        'G': function () {
          return d.getHours();
        },
        'h': function () {
          var hour = d.getHours() % 12;
          if (hour === 0) hour = 12;
          return c(hour);
        },
        'H': function () {
          return c(d.getHours());
        },
        'a': function () {
          return d.getHours() >= 12 ? 'pm' : 'am';
        },
        'A': function () {
          return d.getHours() >= 12 ? 'PM' : 'AM';
        },
        'j': function () {
          return d.getDate();
        },
        'd': function () {
          return c(d.getDate());
        },
        'D': function () {
          var weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          return weekday[d.getDay()];
        },
        'I': function () {
          var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Saturday"];
          return weekday[d.getDay()];
        },
        'n': function () {
          return d.getMonth() + 1;
        },
        'm': function () {
          return c(d.getMonth() + 1);
        },
        't': function (i) {
          var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          var y = d.getFullYear(), m = i || d.getMonth(), r = months[m];
          if (((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) && m === 1) r++;
          return r;
        },
        'M': function () {
          var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return months[d.getMonth()];
        },
        'F': function () {
          var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          return months[d.getMonth()];
        },
        'z': function () {
          var r = 0;
          for (var i = 0; i < d.getMonth(); i++) {
            r = r + fl['t'](i);
          }
          r = r + d.getDate() - 1;
          return r;
        },
        'y': function () {
          return c(d.getFullYear() % 100);
        },
        'Y': function () {
          return d.getFullYear();
        },
        'S': function (i) {
          var num = parseInt(i), s = num % 10, b = num % 100;
          if (s === 0 || s > 3 || (b >= 11 && b <= 13)) {
            return 'th';
          } else if (s === 1) {
            return 'st';
          } else if (s === 2) {
            return 'nd';
          } else {
            return 'rd';
          }
        }
      };
      for (var i = 0; i < l.length; i++) {
        if (fl[l[i]] != null && (i === 0 || l[i - 1] !== '\\')) {
          if (l[i] === 'S') {
            var temp = 0, flag = false;
            for (var j = i - 1; j >= 0; j--) {
              if (!isNaN(parseInt(l[j]))) {
                temp *= 10;
                temp += parseInt(l[j]);
                flag = true;
              } else {
                break;
              }
            }
            l[i] = flag ? fl[l[i]](temp) : '';
          } else {
            l[i] = fl[l[i]]();
          }
        }
      }
      return l.join('');
    },
    formatDate: function (TimeStamp) {
      var now = new Date(),
        Seconds = Math.round(now.getTime() / 1000) - TimeStamp;
      if (Seconds < 2592000) {
        if (Seconds >= 86400) {
          return window.translate('Days_Ago', {'Num': Math.round(Seconds / 86400, 0)});
        } else if (Seconds >= 3600) {
          return window.translate('Hours_Ago', {'Num': Math.round(Seconds / 3600, 0)});
        } else if (Seconds >= 60) {
          return window.translate('Minutes_Ago', {'Num': Math.round(Seconds / 60, 0)});
        } else if (Seconds < 0) {
          return window.translate('Just_Now');
        } else {
          return window.translate('Seconds_Ago', {'Num': Seconds + 1});
        }
      } else {
        if (!TimeStamp) return window.translate('Unknown');
        var da = new Date(TimeStamp * 1000);
        if (da.getFullYear() !== now.getFullYear()) {
          return FimTale.global.date(window.translate('Year_Month_Day'), da.valueOf());
        } else {
          return FimTale.global.date(window.translate('Month_Day'), da.valueOf());
        }
      }
    },
    //归并排序
    mergeSort: function (arr, cond) {
      var a = [],
        b = [],
        mid = Math.floor((arr.length) / 2);
      if (mid > 0) {
        for (var i = 0; i < mid; i++) {
          a.push(arr.pop());
        }
        b = arr;
        a = FimTale.global.mergeSort(a, cond);
        b = FimTale.global.mergeSort(b, cond);
        arr = (function (g, h) {
          var tempArr = [],
            lg = g.length,
            lh = h.length,
            i = 0,
            j = 0;
          while (i < lg && j < lh) {
            tempArr.push(cond(g[i], h[j]) ? g[i++] : h[j++]);
          }
          while (i < lg) {
            tempArr.push(g[i++]);
          }
          while (j < lh) {
            tempArr.push(h[j++]);
          }
          return tempArr;
        })(a, b);
      }
      return arr;
    },
    //获得地址栏的请求字符串并将其解析为键值对
    getQueryStringArgs: function () {
      var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
        args = {},
        items = qs.length ? qs.split('&') : [],
        item = null,
        name = null,
        value = null,
        i = 0,
        len = items.length;
      for (i = 0; i < len; i++) {
        item = items[i].split("=");
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if (name.length) args[name] = value;
      }
      return args;
    },
    //获取选择的内容
    getSelection: function () {
      if (window.getSelection)
        return window.getSelection().toString();
      else if (document.selection)
        return document.selection.createRange().text;
      else
        return '';
    },
    //通过json读取localStorage数据
    getLocalStorage: function (key) {
      var temp = localStorage.getItem(key);
      if (temp) {
        return JSON.parse(temp);
      } else {
        return null;
      }
    },
    setLocalStorage: function (key, value) {
      if (!value) {
        if (localStorage.getItem(key)) localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    },
    //应用模板
    renderTemplate: function (template, list) {
      str = '';
      for (var k in list) {
        str = str + Mustache.render(template, list[k]);
      }
      return str;
    },
    //显示信息
    msg: function (text) {
      if ($(window).width() >= 993) {
        var isAnyModalOpen = false;
        $('.modal').each(function () {
          isAnyModalOpen = isAnyModalOpen || M.Modal.getInstance($(this)).isOpen;
        });
        if (BGP && !isAnyModalOpen) {
          BGP.say(text);
        } else {
          M.toast({html: text});
        }
      } else {
        layer.msg(text);
      }
    },
    //弹窗提示
    alert: function (title, content, callback) {
      layer.alert(content, {
        title: title
      }, function () {
        if (callback) callback();
      });
    },
    //确认信息
    confirm: function (title, content, accepted, rejected, callback) {
      layer.confirm(content, {
          btn: [window.translate('Confirm'), window.translate('Quit')],
          title: title
        },
        function (index) {
          if (callback) callback(true);
          if (accepted != null) accepted();
          layer.close(index);
        }, function (index) {
          if (callback) callback(false);
          if (rejected != null) rejected();
        });
    },
    //转换按钮显示
    syncBtn: function (newBtn, oldBtn, numSelector, type, feature, span) {
      feature = feature || window.translate('Fav_Symbol');
      span = span || 1;
      oldBtn.on('DOMNodeInserted', function () {
        var status = oldBtn.html();
        if (status.indexOf("…") >= 0) {
          newBtn.each(function () {
            $(this).html('more_horiz');
          });
        } else {
          var res = status.indexOf(feature) >= 0 ? type : type + '_border';
          if (res !== newBtn.html().trim()) {
            numSelector.each(function () {
              var oldNumber = parseInt($(this).html().trim());
              if (status.indexOf(feature) >= 0) {
                $(this).html(oldNumber + span);
              } else {
                $(this).html(oldNumber - span);
              }
            });
          }
          newBtn.each(function () {
            $(this).html(res);
          });
        }
      });
    },
    //更新赞踩显示
    refreshVote: function (selectorClass, result) {
      var uSel = $('.upvote-btn.' + selectorClass), dSel = $('.downvote-btn.' + selectorClass),
        uNum = parseInt(uSel.eq(0).attr('data-number')), dNum = parseInt(dSel.eq(0).attr('data-number')),
        uIco = $('.upvote-icon.' + selectorClass), dIco = $('.downvote-icon.' + selectorClass),
        uNumSel = $('.upvote-num.' + selectorClass), dNumSel = $('.downvote-num.' + selectorClass),
        uStat = $('.upvote-status.' + selectorClass), dStat = $('.downvote-status.' + selectorClass),
        uBar = $('.upvote-bar.' + selectorClass), dBar = $('.downvote-bar.' + selectorClass);
      switch (result.LastAction) {
        case 'upvote':
          uIco.removeClass('green-text');
          uStat.removeClass('green-text');
          uNum -= 1;
          uStat.html(translate('Upvote'));
          break;
        case 'downvote':
          dIco.removeClass('red-text');
          dStat.removeClass('red-text');
          dNum -= 1;
          dStat.html(translate('Downvote'));
          break;
      }
      switch (result.CurAction) {
        case 'upvote':
          uIco.addClass('green-text');
          uNum += 1;
          uStat.html(translate('Upvoted')).addClass('green-text');
          break;
        case 'downvote':
          dIco.addClass('red-text');
          dNum += 1;
          dStat.html(translate('Downvoted')).addClass('red-text');
          break;
      }
      uNumSel.html('' + uNum);
      uSel.attr('data-number', uNum);
      uBar.css('width', (100 * uNum / Math.max(uNum + dNum, 1)) + '%');
      dNumSel.html('' + dNum);
      dSel.attr('data-number', dNum);
      dBar.css('width', (100 * dNum / Math.max(uNum + dNum, 1)) + '%');
    },
    //异步加载url对应的js文件并执行回调函数
    loadScript: function (url, callback) {
      var script = document.createElement("script");
      script.id = CryptoJS.MD5(url).toString();
      script.type = "text/javascript";
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState === "loaded" || script.readyState === "complete") {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {
        script.onload = function () {
          callback();
        };
      }
      script.src = url;
      if ($("#" + script.id).length === 0) {
        document.getElementsByTagName("head")[0].appendChild(script);
      } else {
        callback();
      }
    },
    //调取验证码
    fetchTencentCaptcha: function (callback) {
      FimTale.global.msg(window.translate('Captcha_Receiving'));
      FimTale.global.loadScript("https://ssl.captcha.qq.com/TCaptcha.js", function () {
        var captcha = new TencentCaptcha('2027092386', function (res) {
          if (res.ret === 0) callback(res);
        });
        captcha.show();
      });
    },
    //回调函数
    getMyInfoCallback: function (data) {
    },
    //获取个人信息
    getMyInfo: function () {
      FimTale.getJson('getMyInfo', {}, function (res) {
        res.NewNotifications = res.NewReply + res.NewMention + res.NewMessage + res.NewReport + res.NewInteraction + res.UnfinishedForcedTaskNum;
        var bubble = res.NewReview + res.AccomplishedTaskNum;
        $('.notification-bell').removeClass('blink');
        if (res.NewNotifications > 0) {
          $('.notification-bell').addClass('blink');
        }
        $('.navbar-bubble').hide();
        if (bubble) {
          $('.navbar-bubble').show();
        }
        $('.my-info').each(function () {
          var key = $(this).attr('data-info'),
            type = $(this).attr('data-type');
          if (key in res) {
            switch (type) {
              case 'html':
                $(this).html(res[key]);
                break;
              case 'val':
                $(this).val(res[key]);
                break;
              case 'display':
                if (parseInt(res[key]) > 0) {
                  $(this).show();
                } else {
                  $(this).hide();
                }
                break;
            }
          }
        });
        if (FimTale.global.getMyInfoCallback) FimTale.global.getMyInfoCallback(res);
      }, function (err) {
        console.log(err);
      });
    },
    //根据ID获取作品信息
    getTopicInfoByID: function (id, success, failure) {
      if (name.length > 0) {
        FimTale.getJson('getTopicByID', {
          TopicID: id
        }, function (res) {
          success(res);
        }, function (err) {
          console.log(err);
          failure(err);
        });
      } else {
        failure(err);
      }
    },
    //根据名字查找用户
    getUsersByName: function (name, success, failure) {
      if (name.length > 0) {
        FimTale.getJson('getUsersWithSimilarName', {
          UserName: name
        }, function (res) {
          var len = res.length,
            i, data = {};
          for (i = 0; i < len; i++) {
            data[res[i].UserName] = res[i].Avatar;
          }
          success(res);
        }, function (err) {
          console.log(err);
          failure(err);
        });
      } else {
        failure();
      }
    },
    getImageCanvas: function (src, callback) {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        callback(canvas);
      }
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = src;
    },
    //获取主色调
    getMainColorSet: function (src, callback, config) {
      config = $.extend({
        threshold: 8,
        listLength: -1
      }, config);
      FimTale.global.getImageCanvas(src, function (canvas) {
        var imgData = (canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height)).data,
          len = imgData.length / 4,
          halfThreshold = Math.floor(config.threshold / 2),
          list = [],
          counts = {},
          temp = null;
        for (var i = 0; i < len; i++) {
          if (imgData[4 * i + 3] < 128) continue;
          temp = [Math.floor(imgData[4 * i] / config.threshold) * config.threshold + halfThreshold, Math.floor(imgData[4 * i + 1] / config.threshold) * config.threshold + halfThreshold, Math.floor(imgData[4 * i + 2] / config.threshold) * config.threshold + halfThreshold];
          if (Math.abs(temp[0] - temp[1]) < 2 * config.threshold && Math.abs(temp[1] - temp[2]) < 2 * config.threshold && Math.abs(temp[2] - temp[0]) < 2 * config.threshold) continue;
          if (!counts[JSON.stringify(temp)]) counts[JSON.stringify(temp)] = 0;
          counts[JSON.stringify(temp)]++;
        }
        for (var k in counts) {
          list.push(k);
        }
        list = FimTale.global.mergeSort(list, function (a, b) {
          return counts[a] > counts[b];
        });
        if (config.listLength > 0 && config.listLength < list.length) list = list.slice(0, config.listLength);
        if (callback) callback(list);
      });
    },
    getImagePass: function (src, callback) {
      FimTale.global.getMainColorSet(src, function (list) {
        var temp = [];
        for (var i = 0; i < Math.min(5, list.length); i++) {
          temp.push(list[i]);
        }
        var listStr = JSON.stringify(temp);
        callback(CryptoJS.MD5(listStr).toString(), CryptoJS.SHA1(listStr).toString());
      }, {
        threshold: 32,
        listLength: 5
      });
    },
    imageCrop: function (file, confirmed, options) {
      if (options == null) options = {};
      var _options = {
        viewMode: 2,
        croppedImgConfig: null
      };
      $.extend(_options, options);
      if (!window.FileReader) {
        confirmed(file);
      } else {
        var reader = new FileReader(file), cropper = null;
        reader.onload = function (e) {
          var imageSrc = this.result;
          $('head').append('<link href="https://cdn.bootcdn.net/ajax/libs/cropperjs/1.5.9/cropper.min.css" rel="stylesheet">');
          FimTale.global.loadScript('https://cdn.bootcdn.net/ajax/libs/cropperjs/1.5.9/cropper.min.js', function () {
            layer.open({
              title: translate('Crop'),
              area: ['80%', '80%'],
              content: '<div style="position:absolute;top:.5rem;left:.5rem;right:.5rem;bottom:.5rem;"><canvas id="image-crop" style="position:relative;max-width:80%;max-height:80%;margin:0 auto;"></canvas></div>',
              btn: [translate('Confirm'), translate('Quit')],
              success: function (layero, index) {
                var w = $(layero.get(0)), canvas = w.find('#image-crop').get(0),
                  ctx = canvas.getContext("2d"), wWidth = w.innerWidth(), wHeight = w.innerHeight();
                var image = new Image();
                image.onload = function () {
                  canvas.width = image.width;
                  canvas.height = image.height;
                  ctx.drawImage(image, 0, 0, image.width, image.height);
                  cropper = new Cropper(canvas, _options);
                };
                image.src = imageSrc;
              },
              yes: function (index, layero) {
                if (cropper != null) {
                  var cropped = _options.croppedImgConfig != null ? cropper.getCroppedCanvas(_options.croppedImgConfig) : cropper.getCroppedCanvas();
                  cropped.toBlob(function (blobObj) {
                    confirmed(blobObj);
                  });
                }
                layer.close(index);
              },
              btn2: function (index, layero) {
                if (typeof _options.canceled == 'function') _options.canceled();
              }
            });
          });
        };
        reader.readAsDataURL(file);
      }
    },
    //生成分享卡片
    generateShareTicket: function (title, subtitle, link, content) {
      if (content.length > 2000) {
        FimTale.global.msg(window.translate('Too_Long_Share_Ticket_Cannot_Generate'));
        return;
      }
      if (!$('#share-ticket-container').length) {
        $('body').append('<div id="share-ticket-container" class="modal modal-fixed-footer"><div class="modal-content center"><div class="page-subtitle by-theme-text">' + window.translate(FimTale.browser.versions.mobile ? 'Long_Press_To_Share' : 'Copy_To_Share') + '</div><iframe id="share-ticket" style="border:none;width:100%;max-width:400px;margin:0 auto;min-height:50vh;"></iframe></div></div>');
        $('#share-ticket-container').modal();
      }
      var $iframe = $('#share-ticket'),
        iframe = $iframe.get(0),
        gen = function () {
          var _window = iframe.contentWindow;
          if (_window.generateShareTicket) _window.generateShareTicket({
            title: title,
            subtitle: subtitle,
            link: link,
            content: content
          });
        };
      if ($iframe.attr('src') != '/share/ticket') {
        if (iframe.attachEvent) {
          iframe.attachEvent("onload", function () {
            gen();
          });
        } else {
          iframe.onload = function () {
            gen();
          };
        }
        $iframe.attr('src', '/share/ticket');
      } else {
        gen();
      }
      $('#share-ticket-container').modal('open');
    },
    //绑定文章搜索页面
    bindTopicSearch: function (target) {
      target.each(function () {
        var _input = $(this).find('.search-value'),
          _condition = $(this).find('.search-condition'),
          _container = $(this).find('.topic-result');
        var callBack = function (res) {
            if (res.ID > 0) {
              _input.val(res.ID);
              var message = '<div class="card-stacked"><div class="card-content"><p class="card-title original-colored-text" style="font-size: 20px;">' + res.Topic + '</p><p class="grey-text truncate">' + res.UserName + '</p></div></div></div>';
              if (res.IntroImage != null) message = '<div class="card-image" style="position:relative;width:150px;overflow:hidden;"><img src="' + res.IntroImage + '" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);min-width:120%;min-height:100%;max-height:200%;" loading="lazy"></div>' + message;
              _container.html('<div class="card horizontal" style="margin:0;">' + message);
            }
          },
          searchStart = function () {
            var text = _input.val(),
              previousText = _input.attr('data-text') || '';
            _input.attr('data-text', text);
            _container.html('');
            var isSearch = true;
            _condition.each(function () {
              isSearch = isSearch && $(this).val().trim() == $(this).attr('data-true');
            });
            if (isSearch && parseInt(text) != parseInt(previousText)) {
              if (topicSearchDelay != null) clearTimeout(topicSearchDelay);
              topicSearchDelay = setTimeout(function () {
                FimTale.getJson('getTopicByID', {
                  TopicID: parseInt(text)
                }, function (res) {
                  callBack(res);
                }, function (err) {
                  console.log(err);
                });
              }, 2000);
            }
          };
        if (parseInt(_input.val()) > 0) searchStart();
        $(this).find('input').on('input propertychange', function () {
          searchStart();
        });
      });
    }
  },
  //编辑器部分
  editor: {
    //存储所处界面
    interface: null,
    //FTU
    init: function (selector, interfaceIndex, version, newConfig, afterInit) {
      newConfig = newConfig || {};
      setupFunc = newConfig['setupFunc'] || function () {
      };
      afterInit = afterInit || function () {
      };
      FimTale.editor.interface = interfaceIndex;
      if (newConfig['auto_save_code']) FimTale.editor.autoSave.code = newConfig['auto_save_code'];
      var _config = {
        selector: '#' + selector,
        plugins: 'image autolink link lists charmap code media imagetools wordcount indent2em',
        external_plugins: {
          'indent2em': '/static/tinymce/plugins/indent2em/plugin.min.js'
        },
        mediaembed_max_width: 450,
        language_url: window.translate('TinyMCE_Language_Path'),
        language: window.translate('TinyMCE_Locale'),
        use_at: true,
        init_instance_callback: function (editor) {
          if (_config['use_at']) FimTale.editor.tools.atInit();
          if (window.localStorage) {
            if (typeof FimTale.editor.autoSave.timer !== "undefined") {
              clearInterval(FimTale.editor.autoSave.timer);
              console.log(window.translate('Auto_Save_Stopped'));
            }
            FimTale.editor.autoSave[FimTale.editor.interface]();
          }
          editor.setContent(Content || '');
          afterInit();
          console.log("Editor: " + editor.id + " is now initialized.");
        },
        menubar: 'edit insert view format table tools',
        contextmenu: false,
        image_advtab: true,
        relative_urls: false,
        convert_urls: false,
        remove_script_host: false,
        toolbar_drawer: false,
        toolbar: "code fimtalepreview undo redo selectall cut copy paste pastetext | styleselect forecolor backcolor | bold italic underline strikethrough superscript subscript alignleft aligncenter alignright alignjustify removeformat indent2em | bullist numlist blockquote image table link at ftemoji | spoiler",
        mobile: {
          toolbar: "code fimtalepreview undo redo selectall cut copy paste pastetext styleselect forecolor backcolor bold italic underline strikethrough superscript subscript alignleft aligncenter alignright alignjustify removeformat indent2em bullist numlist blockquote image table link at ftemoji spoiler"
        },
        fontsize_formats: '6px 8px 10px 12px 14px 16px 18px 20px 22px 24px 30px 36px 42px 48px 60px',
        images_upload_handler: function (blobInfo, success, failure) {
          var f = blobInfo.blob(), n = f.name, t = f.type;
          if (['image/gif'].indexOf(t) >= 0) {
            FimTale.editor.tools.imageUpload(f, success, failure);
          } else {
            FimTale.global.imageCrop(f, function (image) {
              var imageFile = new File([image], n, {type: t});
              FimTale.editor.tools.imageUpload(imageFile, success, failure);
            }, {
              ready: function () {
                var cropper = this.cropper, containerData = cropper.getImageData();
                cropper.setCropBoxData({
                  left: 0,
                  top: 0,
                  width: containerData.width,
                  height: containerData.height
                });
              },
              canceled: function () {
                success('');
              }
            });
          }
        },
        setup: function (editor) {
          editor.ui.registry.addButton('fimtalepreview', {
            icon: 'preview',
            tooltip: window.translate('Preview'),
            onAction: function () {
              if (!tinymce.activeEditor) return;
              var editorContent = tinymce.activeEditor.getContent(),
                shortCodes = {
                  "login": function (content) {
                    return '<div class="card"><div class="card-content"><span class="card-title by-theme-text">' + window.translate('Read_By_Login') + '</span>' + content + '</div></div>';
                  },
                  "collapse": function (content) {
                    return '<div class="card collapse-container by-theme" style="transition: all .3s;" onclick="var _header = $(this).children(\'.collapse-header\'), _content = $(this).children(\'.collapse-content\'); if(_content.is(\':visible\')){_header.show(); _content.hide(); $(this).addClass(\'by-theme\');} else {_header.hide(); _content.show(); $(this).removeClass(\'by-theme\');}"><div class="collapse-header card-content white-text"><i class="material-icons left">&#xe5c5;</i>' + window.translate('Unfold_Content') + '</div><div class="collapse-content card-content" style="display: none;"><span class="card-title by-theme-text">' + window.translate('Collapsed_Content') + '</span>' + content + '</div></div>';
                  },
                  "reply": function (content) {
                    return shortCodes['collapse'](content);
                  },
                  "markdown": function (content) {
                    var converter = new showdown.Converter();
                    return '<div class="markdown-area">' + converter.makeHtml(content) + '</div>';
                  },
                  "spoiler": function (content) {
                    return '<span class="spoiler">' + content + '</span>';
                  }
                };
              for (var k in shortCodes) {
                editorContent = editorContent.replace(new RegExp('\\\[' + k + '\\\](([^\\\[]|\\\[(?!\\\/?' + k + '\]))+)\\\[\\\/' + k + '\\\]', 'g'), function (a, b) {
                  return shortCodes[k](b);
                });
              }
              editorContent = FTEmoji.toFTEmoji(emojione.toImage(editorContent));
              if (!$('#fimtale-preview-container').length) {
                $('body').append('<div id="fimtale-preview-container" class="modal modal-fixed-footer"><div class="modal-content"><div class="page-subtitle by-theme-text">' + window.translate('Preview') + '</div><iframe id="fimtale-preview" style="position:relative;border:none;height:calc(100% - 64px);width:100%;"></iframe></div><div class="modal-footer"><a class="modal-close waves-effect waves-light btn-flat">' + window.translate('Quit') + '</a></div></div>');
                $('#fimtale-preview-container').modal();
              }
              var $iframe = $('#fimtale-preview'),
                iframe = $iframe.get(0),
                _window = iframe.contentWindow;
              $(iframe.contentWindow.document.head).append('<link href="/static/css/materialize.css" rel="stylesheet"><link id="fimtale-theme-basic" href="/static/css/main.css" rel="stylesheet" type="text/css" />');
              $(iframe.contentWindow.document.body).html(editorContent).css('padding', '1rem 0');
              $('#fimtale-preview-container').modal('open');
              var tempFS = new FontSetter();
              tempFS.applyPassageFontSize($(iframe.contentWindow.document.body));
            }
          });
          if (_config['use_at']) editor.ui.registry.addButton('at', {
            text: '@',
            tooltip: window.translate('At_Sb'),
            onAction: function () {
              $('#at-search-input').val('');
              $('#at-list-result').html('');
              $('#at-container').modal('open');
            }
          });
          editor.ui.registry.addButton('ftemoji', {
            icon: 'emoji',
            tooltip: 'FimTale Emoji',
            onAction: function () {
              FTEmoji.openPanel();
            }
          });
          editor.ui.registry.addButton('spoiler', {
            text: window.translate('Spoiler_Title'),
            tooltip: window.translate('Spoiler_Desc'),
            onAction: function () {
              FimTale.editor.tools.insertShortcodes(editor, '[spoiler]' + window.translate('Spoiler_Placeholder') + '[/spoiler]');
            }
          });
          setupFunc(editor);
        },
        content_css: "/static/css/materialize.css?version=" + version + ",/static/css/main.css?version=" + version + ",/static/css/tinymce_content.css?version=" + version
      };
      $.extend(_config, newConfig);
      FimTale.global.loadScript("https://cdn.bootcdn.net/ajax/libs/tinymce/5.2.2/tinymce.min.js", function () {
        tinymce.init(_config);
      });
    },
    //编辑器标签处理
    tags: {
      //自动添加标签
      addTag: function (names) {
        if (typeof names == 'string') {
          names = [names];
        }
        var tagsExist = FimTale.editor.tags.getTags();
        for (var k in names) {
          var name = names[k];
          if (name in tagsExist) continue;
          var tag_md5 = CryptoJS.MD5(name).toString();
          if ($('#tag-' + tag_md5).length) {
            $('#tag-' + tag_md5).prop("checked", true);
          } else {
            $('.chips').chips('addChip', {'tag': name});
          }
        }
      },
      //获取目前选中的标签
      getTags: function () {
        var char_tags = $.map(M.Chips.getInstance($('.chips')).chipsData, function (n) {
          return n.tag;
        });
        var other_tags = $.map($('.tag-selector:checked'), function (n) {
          return $(n).attr('tag-name');
        });
        return $.merge(char_tags, other_tags);
      },
      //清空所有已选中的标签
      removeTags: function (tags) {
        if (typeof tags == 'string') {
          tags = [tags];
        }
        if (!tags) {
          $('.tag-selector:checked').each(function () {
            $(this).prop("checked", false);
          });
        } else {
          for (var p in tags) {
            var tag_md5 = CryptoJS.MD5(tags[p]).toString();
            if ($('#tag-' + tag_md5).length) {
              $('#tag-' + tag_md5).prop("checked", false);
            }
          }
        }
        $('.chips').each(function () {
          var instance = M.Chips.getInstance($(this)),
            tagsExist = FimTale.editor.tags.getTags(),
            chipsMap = {};
          if (!tags) {
            while (instance.chipsData.length > 0) {
              instance.deleteChip(0);
            }
          } else {
            for (var i = 0; i < instance.chipsData.length; i++) {
              chipsMap[instance.chipsData[i]['tag']] = i;
            }
            var div = 0;
            for (var t in tags) {
              if (typeof chipsMap[tags[t]] == 'number' && chipsMap[tags[t]] >= div) {
                instance.deleteChip(chipsMap[tags[t]] - div);
                div++;
              }
            }
          }
        });
      }
    },
    //自动保存
    autoSave: {
      //自动保存计时器（经由下面的函数初始化获得）
      timer: null,
      //代号
      code: window.location.href,
      //作品的自动保存
      topic: {
        //保存
        save: function () {
          try {
            var TagList = JSON.stringify(FimTale.editor.tags.getTags());
            if (document.NewForm.Title.value.length >= 1) {
              localStorage.setItem(Prefix + FimTale.editor.autoSave.code + "TopicTitle", document.NewForm.Title.value);
            }
            if (document.NewForm.Intro.value.length >= 1) {
              localStorage.setItem(Prefix + FimTale.editor.autoSave.code + "TopicIntro", document.NewForm.Intro.value);
            }
            if (tinymce.get('editor').getContent().length >= 10) {
              localStorage.setItem(Prefix + FimTale.editor.autoSave.code + "TopicContent", tinymce.get('editor').getContent());
            }
            if (TagList) {
              localStorage.setItem(Prefix + FimTale.editor.autoSave.code + "TopicTagList", TagList);
            }
          } catch (oException) {
            if (oException.name === 'QuotaExceededError') {
              console.log(window.translate('Draft_Out_Of_Memory'));
              localStorage.clear();
              setTimeout(function () {
                FimTale.editor.autoSave.topic.save()
              }, 5000);
            }
          }
        },
        //恢复
        recover: function () {
          document.NewForm.Title.value = localStorage.getItem(Prefix + FimTale.editor.autoSave.code + "TopicTitle") || localStorage.getItem(Prefix + window.location.href + "TopicTitle") || document.NewForm.Title.value;
          document.NewForm.Intro.value = localStorage.getItem(Prefix + FimTale.editor.autoSave.code + "TopicIntro") || localStorage.getItem(Prefix + window.location.href + "TopicIntro") || document.NewForm.Intro.value;
          tinymce.get('editor').setContent(localStorage.getItem(Prefix + FimTale.editor.autoSave.code + "TopicContent") || localStorage.getItem(Prefix + window.location.href + "TopicContent") || '');
          var DraftTagList = JSON.parse(localStorage.getItem(Prefix + FimTale.editor.autoSave.code + "TopicTagList") || localStorage.getItem(Prefix + window.location.href + "TopicTagList") || '[]');
          if (DraftTagList) FimTale.editor.tags.addTag(DraftTagList);
          M.updateTextFields();
        },
        //停止保存
        stop: function () {
          clearInterval(FimTale.editor.autoSave.timer);
          FimTale.editor.autoSave.topic.clear();
          tinymce.get('editor').setContent('');
        },
        //清空
        clear: function () {
          localStorage.removeItem(Prefix + FimTale.editor.autoSave.code + "TopicTitle");
          localStorage.removeItem(Prefix + FimTale.editor.autoSave.code + "TopicIntro");
          localStorage.removeItem(Prefix + FimTale.editor.autoSave.code + "TopicContent");
          localStorage.removeItem(Prefix + FimTale.editor.autoSave.code + "TopicTagList");
          localStorage.removeItem(Prefix + window.location.href + "TopicTitle");
          localStorage.removeItem(Prefix + window.location.href + "TopicIntro");
          localStorage.removeItem(Prefix + window.location.href + "TopicContent");
          localStorage.removeItem(Prefix + window.location.href + "TopicTagList");
        }
      },
      //草稿自动保存
      draft: {
        //保存
        save: function () {
          try {
            if (tinymce.get('editor').getContent().length >= 10) {
              localStorage.setItem(Prefix + FimTale.editor.autoSave.code + "PostContent", tinymce.get('editor').getContent());
            }
          } catch (oException) {
            if (oException.name === 'QuotaExceededError') {
              console.log(window.translate('Draft_Out_Of_Memory'));
              localStorage.clear(); //Clear all draft
              setTimeout(function () {
                FimTale.editor.autoSave.draft.save()
              }, 5000);
            }
          }
        },
        //恢复
        recover: function () {
          var DraftContent = localStorage.getItem(Prefix + FimTale.editor.autoSave.code + "PostContent") || localStorage.getItem(Prefix + window.location.href + "PostContent") || '';
          if (DraftContent) {
            tinymce.get('editor').setContent(DraftContent);
          } else {
            tinymce.get('editor').setContent('');
          }
        },
        //停止保存
        stop: function () {
          clearInterval(FimTale.editor.autoSave.timer);
          FimTale.editor.autoSave.draft.clear();
          tinymce.get('editor').setContent('');
        },
        //清空
        clear: function () {
          localStorage.removeItem(Prefix + FimTale.editor.autoSave.code + "PostContent");
          localStorage.removeItem(Prefix + window.location.href + "PostContent");
        }
      },
      //new页的自动保存指令集
      new: function () {
        FimTale.editor.autoSave.topic.recover();
        FimTale.editor.autoSave.timer = setInterval(function () {
          FimTale.editor.autoSave.topic.save();
        }, 1000);
        console.log(window.translate('Auto_Save_Started'));
        console.log(window.translate('Editor_Started'));
      },
      //edit页的自动保存指令集
      edit: function () {
        console.log(window.translate('Editor_Started'));
      },
      //评论的自动保存指令集
      reply: function () {
        FimTale.editor.autoSave.draft.recover();
        FimTale.editor.autoSave.timer = setInterval(function () {
          FimTale.editor.autoSave.draft.save();
        }, 1000);
        console.log(window.translate('Auto_Save_Started'));
        console.log(window.translate('Editor_Started'));
      }
    },
    //工具
    tools: {
      //上传base64图片(待调试)
      uploadBase64Image: function (base64url, success) {
        var temp = base64url.split(','),
          mime = temp[0].match(/:(.*?);/)[1],
          bstr = atob(temp[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        var blob = new Blob([u8arr], {type: mime});
        blob.lastModifiedDate = new Date();
        blob.name = new Date() + mime.split('/')[1];

        FimTale.editor.tools.imageUpload(blob, function (url) {
          success(url);
        });
      },
      //从本地导入
      uploadFromFile: function (f, onSuccess) {
        var name = f.name,
          namesArr = name.split('.'),
          type = namesArr[namesArr.length - 1],
          reader = new FileReader();
        switch (type) {
          case 'docx':
            reader.onload = function () {
              var arrBuf = this.result;
              FimTale.global.loadScript('https://cdn.bootcdn.net/ajax/libs/mammoth/1.4.13/mammoth.browser.min.js', function () {
                mammoth.convertToHtml({arrayBuffer: arrBuf}).then(function (result) {
                  console.log(result.messages);
                  var text = result.value,
                    tempDiv = $('<div></div>'),
                    imagesFileArr = [];
                  tempDiv.html(text);
                  tempDiv.find('img').each(function () {
                    var ord = imagesFileArr.length;
                    imagesFileArr.push($(this).attr('src'));
                    $(this).removeAttr('src').addClass('images-ready-to-upload-' + ord);
                  });
                  onSuccess(name.replace(/\.docx$/, ''), tempDiv.html(), imagesFileArr);
                }).done();
              });
            }
            reader.readAsArrayBuffer(f);
            break;
          case 'txt':
            reader.onload = function () {
              var text = this.result.replace(/\n/g, '\\n'),
                tempDiv = $('<div></div>');
              tempDiv.text(text);
              onSuccess(name.replace(/\.txt$/, ''), '<p>' + tempDiv.html().replace(/\\n/g, '</p><p>') + '</p>', []);
            }
            reader.readAsText(f);
            break;
          default:
            FimTale.global.msg(window.translate('Unsupported_File_Type'));
            break;
        }
      },
      //开启/关闭手机端编辑器拓展工具栏
      displayAdditionalToolbar: function () {
        var isIn = !!$('html').attr('style'),
          target = $('#more-functions');
        if (isIn) {
          if (!target.is(':visible')) target.show().floatingActionButton({hoverEnabled: false});
        } else {
          if (target.is(':visible')) target.hide();
        }
      },
      //插入shortcode
      insertShortcodes: function (editor, code) {
        editor.insertContent(code);
      },
      imgBoxTokenId: null,
      imgBoxTokenSecret: null,
      uploadToImgBox: function (file, success, failure, onProgress) {
        var imgboxFormData = new FormData();
        imgboxFormData.append('token_id', FimTale.editor.tools.imgBoxTokenId);
        imgboxFormData.append('token_secret', FimTale.editor.tools.imgBoxTokenSecret);
        imgboxFormData.append('content_type', '1');
        imgboxFormData.append('thumbnail_size', '100c');
        imgboxFormData.append('gallery_id', 'null');
        imgboxFormData.append('gallery_secret', 'null');
        imgboxFormData.append('comments_enabled', '0');
        imgboxFormData.append('files[]', file);
        $.ajax({
          url: 'https://imgbox.fimtale.com/upload/process',
          type: 'POST',
          processData: false,
          contentType: false,
          data: imgboxFormData,
          xhr: function () {
            var xhr = $.ajaxSettings.xhr();
            if (typeof onProgress == 'function' && xhr.upload) {
              xhr.upload.onprogress = onProgress;
            }
            return xhr;
          },
          success: function (res) {
            if (typeof res == 'string') res = JSON.parse(res);
            if (res.files) {
              var url = res.files[0].original_url;
              url = url.replace(/images2\.imgbox\.com/, "imgbox-get.fimtale.com");
              url = url.replace(/images\.imgbox\.com/, "imgbox-get.fimtale.com");
              success(url);
            } else {
              if (failure != null) failure(JSON.stringify(res));
            }
          },
          error: function (err) {
            if (failure != null) failure(err.responseText);
          }
        });
      },
      //传图
      imageUpload: function (file, success, failure, onProgress) {
        var n = file.name, t = file.type, _upload = function (file) {
          if (FimTale.editor.tools.imgBoxTokenId == null || FimTale.editor.tools.imgBoxTokenSecret == null) {
            $.ajax('https://imgbox.fimtale.com/ajax/token/generate', {
              success: function (data) {
                FimTale.editor.tools.imgBoxTokenId = data.token_id;
                FimTale.editor.tools.imgBoxTokenSecret = data.token_secret;
                FimTale.editor.tools.uploadToImgBox(file, success, failure, onProgress);
              },
              error: function (err) {
                FimTale.global.msg(window.translate('Token_Get_Failed'));
              }
            });
          } else {
            FimTale.editor.tools.uploadToImgBox(file, success, failure, onProgress);
          }
        };
        if (['image/gif'].indexOf(t) >= 0) {
          _upload(file);
        } else {
          var dividentRatio = 9 / 16, maxSize = 1280, quality = 0.9, reader = new FileReader(),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
          reader.onloadend = function () {
            var image = new Image();
            image.onload = function () {
              var ratio = Math.min(1, Math[image.width / Math.max(image.height, 1) < dividentRatio ? 'max' : 'min'](maxSize / Math.max(1, image.width), maxSize / Math.max(1, image.height)));
              canvas.width = Math.ceil(image.width * ratio);
              canvas.height = Math.ceil(image.height * ratio);
              ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
              canvas.toBlob(function (blob) {
                file = new File([blob], n, {type: t});
                _upload(file);
              }, t, quality);
            };
            image.src = reader.result;
          };
          reader.readAsDataURL(file);
        }
      },
      //一键排版
      oneKeyTypeSetting: function () {
        var oriText = tinymce.activeEditor.getContent();
        oriText = oriText.replace(/<p[^>]*>((?!<\/p>).*)?<\/p>/g, function (a, c) {
          return FimTale.editor.tools.formingHTML(c);
        }).replace(/<span[^>]+>((?!<\/span><br>).*)?<\/span><br>/g, function (a, c) {
          return FimTale.editor.tools.formingHTML(c);
        }).replace(/<p><\/p>/g, "");
        tinymce.activeEditor.setContent(oriText);
        //console.log(oriText);
      },
      formingHTML: function (originalHTML) {
        //console.log(originalHTML);
        originalHTML = originalHTML.replace(/<\!\-\-(.*)\-\->/g, '').replace(/<span style="text-decoration: underline;">((?!<\/span>).)*?<\/span>/g, function (d, e) {
          return '<ins>' + e + '</ins>';
        }).replace(/<span style="text-decoration: line-through;">((?!<\/span>).)*?<\/span>/g, function (f, g) {
          return '<del>' + g + '</del>';
        }).replace(/<\/?((?!img|strong|em|ins|del|sub|sup).)*?\/?>/g, '').replace(/&nbsp;/ig, '');
        var hasImg = originalHTML.match(/<img[^>]+>/g),
          imgString = null;
        if (hasImg != null) {
          var len = hasImg.length;
          imgString = "";
          for (var i = 0; i < len; i++) {
            imgString = imgString + hasImg[i];
          }
        }
        return '<p>' + originalHTML + '</p>';
      },
      searchDelay: null,
      //艾特
      bindNameSearch: function (inputSelector, success, failure) {
          var IME_flag=true;
          function searchUnit(){
              var text = inputSelector.val(),
              previousText = inputSelector.attr('data-text') || '';
              inputSelector.attr('data-text', text);
              if (!previousText.length || text.indexOf(previousText) > -1) {
                  if (FimTale.editor.tools.searchDelay != null) clearTimeout(FimTale.editor.tools.searchDelay);
                  FimTale.editor.tools.searchDelay = setTimeout(function () {
                      if(IME_flag){
                          FimTale.global.getUsersByName(text, function (res) {
                              var tempRes = {};
                              for (var k in res) {
                                  tempRes[res[k]['UserName']] = res[k]['Avatar'];
                                  }
                              success(tempRes);
                              }, function (err) {
                                  failure(err);
                              })};
                  }, 1000);
              } else {
                  failure();
                  }}
          inputSelector.on('compositionstart',function(){
              IME_flag=false;
              });
          inputSelector.on('compositionend',function(){
              IME_flag=true;
              searchUnit();
              });
          inputSelector.on('input propertychange', function () {
              searchUnit();
              });
      },
      atInit: function () {
        $('body').append('<div id="at-container" class="modal modal-fixed-footer"><a href="#!" class="modal-close waves-effect waves-red btn-flat" style="position:absolute;top:0%;right:0%;font-size:30px;">×</a><div class="modal-content"><div class="input-field"><i class="material-icons prefix">&#xe8b6;</i><input id="at-search-input" type="text" placeholder="' + window.translate('Search_By_UserName') + '"></div><table id="at-list-result"></table></div></div>');
        $('#at-container').modal();
        FimTale.editor.tools.bindNameSearch($('#at-search-input'), function (res) {
          var textRes = '',
            onClickTemplate = function (name) {
              return "FimTale.editor.tools.insertShortcodes(tinymce.activeEditor, ' @" + name + " ');$('#at-container').modal('close');";
            };
          for (var k in res) {
            textRes = textRes + '<tr><td onclick="' + onClickTemplate(k) + '" style="cursor: pointer;"><img src="' + res[k] + '" class="inline-avatar circle" loading="lazy"> ' + k + '</td></tr>';
          }
          $('#at-list-result').html(textRes);
        }, function () {
        });
      }
    }
  },
  //发表部分
  post: {
    //发表前的检查
    check: function (checkTitle) {
      if (checkTitle && document.NewForm.Title.value.length <= 0) {
        FimTale.global.msg(window.translate('Object_Cannot_Be_Empty', {'Object': window.translate('Title')}));
        document.NewForm.Title.focus();
        return false;
      }
      if (document.NewForm.Title.value.replace(/[^\x00-\xff]/g, "***").length > MaxTitleChars) {
        FimTale.global.msg(window.translate('Object_Too_Long', {
          'Object': window.translate('Title'),
          'Limit': MaxTitleChars
        }));
        document.NewForm.Title.focus();
        return false;
      }
      if (!tinymce.get('editor').getContent().length) {
        FimTale.global.msg(window.translate('Object_Cannot_Be_Empty', {'Object': window.translate('Content')}));
        tinymce.get('editor').focus();
        return false;
      }
      if (!IsChapter) {
        var tags = FimTale.editor.tags.getTags(),
          type = null;
        if (tags.length === 0) {
          FimTale.global.msg(window.translate('Object_Cannot_Be_Empty', {'Object': window.translate('Tag')}));
          return false;
        }
        for (var t in tags) {
          if (tags[t] === '文楼' || tags[t] === '图楼' || tags[t] === '帖子') type = tags[t];
        }
        if (type === null) {
          FimTale.global.msg(window.translate('Object_Cannot_Be_Empty', {'Object': window.translate('Topic_Type')}));
          return false;
        }
        if (type !== '帖子') {
          if (document.NewForm.Intro.value.length > 150) {
            FimTale.global.msg(window.translate('Object_Too_Long', {
              'Object': window.translate('Intro'),
              'Limit': 150
            }));
            document.NewForm.Intro.focus();
            return false;
          }
        }
      }
      return true;
    },
    //处理作品中的不规范内容
    processContent: function (content) {
      if ($('#fimtale-temp-text').length == 0) $('body').append('<div id="fimtale-temp-text" style="display:none"></div>');
      var selector = $('#fimtale-temp-text');
      selector.html(content);
      selector.find('*').each(function () {
        $(this).removeAttr('width').removeAttr('height');
      });
      selector.find('img').each(function () {
        if ($(this).css('margin-left') == 'auto' && $(this).css('margin-right') == 'auto') $(this).parent().css('text-align', 'center');
        if ($(this).css('float') == 'left' || $(this).css('float') == 'right') $(this).parent().css('text-align', $(this).css('float'));
        $(this).removeAttr('style');
      });
      selector.find('a').each(function () {
        var href = $(this).attr('href');
        if (href && href.length) $(this).attr('href', href.split('#')[0]);
      });
      return selector.html();
    },
    //上传通用指令集
    upload: function (path, data, before, success, error) {
      before();
      $.ajax({
        url: WebsitePath + path,
        data: data,
        type: 'post',
        cache: false,
        dataType: 'json',
        async: true,
        success: function (data) {
          success(data);
        },
        error: function (err) {
          error(err);
        }
      });
    },
    //新建作品
    newTopic: function () {
      if (FimTale.post.check(true) === false) return false;
      var data = {
        FormHash: document.NewForm.FormHash.value,
        Title: document.NewForm.Title.value,
        Intro: document.NewForm.Intro.value,
        IntroImage: document.NewForm.IntroImage.value,
        OriginalLink: document.NewForm.OriginalLink.value,
        Content: FimTale.post.processContent(tinymce.get('editor').getContent()),
        Tag: JSON.stringify(FimTale.editor.tags.getTags()),
        Id: document.NewForm.storyid.value,
        Prequel: $('#prequel').val()
      };
      FimTale.global.fetchTencentCaptcha(function (res) {
        data['tencentCode'] = res.ticket;
        data['tencentRand'] = res.randstr;
        FimTale.post.upload('/new/topic', data, function () {
          $("#PublishButton").val(window.translate('Posting')).addClass('disabled');
          FimTale.global.msg(window.translate('Posting_Please_Wait'));
        }, function (data) {
          if (data.Status === 1) {
            $("#PublishButton").val(window.translate('Action_Complete', {"Action": window.translate('Post')}));
            if (window.localStorage) {
              FimTale.editor.autoSave.topic.stop();
            }
            FimTale.global.msg(window.translate('Action_Complete', {"Action": window.translate('Post')}));
            if (data.Href !== '') location.href = data.Href;
          } else {
            FimTale.global.msg(data.ErrorMessage);
            $("#PublishButton").val(window.translate('Post')).removeClass('disabled');
          }
        }, function (err) {
          FimTale.global.confirm(window.translate('Action_Failed', {"Action": window.translate('Post')}), window.translate('Action_Failed', {"Action": window.translate('Post')}) + ', ' + window.translate('Feedback_Confirm'), function () {
            FimTale.report.addReasonWithTarget('system', 0, err.responseText);
          });
          console.log(err.responseText);
          $("#PublishButton").val(window.translate('Post')).removeClass('disabled');
        });
      });
      return true;
    },
    //编辑作品
    editTopic: function () {
      if (FimTale.post.check(true) === false) return false;
      var data = {
        FormHash: document.NewForm.FormHash.value,
        Title: document.NewForm.Title.value,
        Intro: document.NewForm.Intro.value,
        IntroImage: document.NewForm.IntroImage.value,
        OriginalLink: document.NewForm.OriginalLink.value,
        Content: FimTale.post.processContent(tinymce.get('editor').getContent()),
        Tag: JSON.stringify(FimTale.editor.tags.getTags()),
        Prequel: $('#prequel').val(),
        Id: PostID
      };
      FimTale.post.upload('/edit/topic', data, function () {
        FimTale.global.msg(window.translate('Posting_Please_Wait'));
        $("#PublishButton").val(window.translate('Posting')).addClass('disabled');
      }, function (data) {
        if (data.Status === 1) {
          $("#PublishButton").val(window.translate('Action_Complete', {"Action": window.translate('Post')}));
          if (window.localStorage) {
            FimTale.editor.autoSave.topic.stop();
          }
          FimTale.global.msg(window.translate('Action_Complete', {"Action": window.translate('Post')}));
          if (data.Href !== '') location.href = data.Href;
        } else {
          FimTale.global.msg(data.ErrorMessage);
          $("#PublishButton").val(window.translate('Post')).removeClass('disabled');
        }
      }, function (err) {
        FimTale.global.confirm(window.translate('Action_Failed', {"Action": window.translate('Post')}), window.translate('Action_Failed', {"Action": window.translate('Post')}) + ', ' + window.translate('Feedback_Confirm'), function () {
          FimTale.report.addReasonWithTarget('system', 0, err.responseText);
        });
        console.log(err.responseText);
        $("#PublishButton").val(window.translate('Post')).removeClass('disabled');
      });
      return true;
    },
    //新建博文
    newBlogpost: function () {
      if (FimTale.post.check(false) === false) return false;
      var data = {
        FormHash: document.NewForm.FormHash.value,
        Title: document.NewForm.Title.value,
        Content: FimTale.post.processContent(tinymce.get('editor').getContent()),
        RelatedType: $('#related-type').val(),
        RelatedID: $('#related-id').val(),
        RelatedCommentID: $('#related-comment-id').val(),
        IsPrivate: document.getElementById('set-blog-private').checked ? '1' : '0'
      };
      FimTale.global.fetchTencentCaptcha(function (res) {
        data['tencentCode'] = res.ticket;
        data['tencentRand'] = res.randstr;
        FimTale.post.upload('/new/blog', data, function () {
          $("#PublishButton").val(window.translate('Posting')).addClass('disabled');
          FimTale.global.msg(window.translate('Posting_Please_Wait'));
        }, function (data) {
          if (data.Status === 1) {
            $("#PublishButton").val(window.translate('Action_Complete', {"Action": window.translate('Post')}));
            if (window.localStorage) {
              FimTale.editor.autoSave.topic.stop();
            }
            FimTale.global.msg(window.translate('Action_Complete', {"Action": window.translate('Post')}));
            if (data.Href !== '') location.href = data.Href;
          } else {
            FimTale.global.msg(data.ErrorMessage);
            $("#PublishButton").val(window.translate('Post')).removeClass('disabled');
          }
        }, function (err) {
          FimTale.global.confirm(window.translate('Action_Failed', {"Action": translate('Post')}), translate('Action_Failed', {"Action": translate('Post')}) + ', ' + translate('Feedback_Confirm'), function () {
            FimTale.report.addReasonWithTarget('system', 0, err.responseText);
          });
          console.log(err.responseText);
          $("#PublishButton").val(translate('Post')).removeClass('disabled');
        });
      });
      return true;
    },
    //编辑博文
    editBlogpost: function () {
      if (FimTale.post.check(false) === false) return false;
      var data = {
        FormHash: document.NewForm.FormHash.value,
        Title: document.NewForm.Title.value,
        Content: FimTale.post.processContent(tinymce.get('editor').getContent()),
        RelatedType: $('#related-type').val(),
        RelatedID: $('#related-id').val(),
        RelatedCommentID: $('#related-comment-id').val(),
        IsPrivate: document.getElementById('set-blog-private').checked ? '1' : '0',
        Id: PostID
      };
      FimTale.post.upload('/edit/blog', data, function () {
        FimTale.global.msg(translate('Posting_Please_Wait'));
        $("#PublishButton").val(translate('Posting')).addClass('disabled');
      }, function (data) {
        if (data.Status === 1) {
          $("#PublishButton").val(translate('Action_Complete', {"Action": translate('Post')}));
          if (window.localStorage) {
            FimTale.editor.autoSave.topic.stop();
          }
          FimTale.global.msg(translate('Action_Complete', {"Action": translate('Post')}));
          if (data.Href !== '') location.href = data.Href;
        } else {
          FimTale.global.msg(data.ErrorMessage);
          $("#PublishButton").val(translate('Post')).removeClass('disabled');
        }
      }, function (err) {
        FimTale.global.confirm(translate('Action_Failed', {"Action": translate('Post')}), translate('Action_Failed', {"Action": translate('Post')}) + ', ' + translate('Feedback_Confirm'), function () {
          FimTale.report.addReasonWithTarget('system', 0, err.responseText);
        });
        console.log(err.responseText);
        $("#PublishButton").val(translate('Post')).removeClass('disabled');
      });
      return true;
    },
    //发表评论
    comment: function (IsBroadcast) {
      IsBroadcast = IsBroadcast || false;
      if (!tinymce.get('editor').getContent().length) {
        FimTale.global.msg(translate('Object_Cannot_Be_Empty', {'Object': translate('Content')}));
        tinymce.get('editor').focus();
        return false;
      }
      var data = {
        FormHash: document.comment.FormHash.value,
        Id: document.comment.ID.value,
        Target: document.comment.Target.value,
        Content: FimTale.post.processContent(tinymce.get('editor').getContent()),
        IsForward: ($('#is-forward').length > 0 && $('#is-forward').is(':checked')) ? 1 : 0,
        IsBroadcast: IsBroadcast ? 1 : 0
      };
      FimTale.global.fetchTencentCaptcha(function (res) {
        data['tencentCode'] = res.ticket;
        data['tencentRand'] = res.randstr;
        FimTale.post.upload('/new/comment', data, function () {
          FimTale.global.msg(translate('Posting_Please_Wait'));
          $("#CommentButton").val('……').addClass('disabled');
        }, function (data) {
          if (data.Status === 1) {
            if (window.localStorage) {
              FimTale.editor.autoSave.draft.stop();
            }
            FimTale.global.msg(translate('Post_Comment_Complete' + (parseInt(data.Bits) > 0 ? '_With_Bits' : ''), {"Bits": data.Bits}));
            $('.comment-editor-toolbar input[type="checkbox"]').prop('checked', false);
            if (data.Href !== '') $.pjax({
              url: data.Href,
              container: '.comment-list',
              fragment: '.comment-list',
              timeout: 15000,
              scrollTo: false
            });
          } else {
            FimTale.global.msg(data.ErrorMessage);
          }
          $("#CommentButton").val(translate('Post')).removeClass('disabled');
        }, function (err) {
          FimTale.global.confirm(translate('Action_Failed', {"Action": translate('Post')}), translate('Action_Failed', {"Action": translate('Post')}) + ', ' + translate('Feedback_Confirm'), function () {
            FimTale.report.addReasonWithTarget('system', 0, err.responseText);
          });
          console.log(err.responseText);
          $("#CommentButton").val(translate('Post')).removeClass('disabled');
        });
      });
      return true;
    }
  },
  //作品部分
  topic: {
    //作品相关信息
    topicID: 0,
    postID: 0,
    mainID: 0,
    //初始化（输入作品相关信息）
    init: function (tID, pID, mID) {
      FimTale.topic.topicID = tID;
      FimTale.topic.postID = pID;
      FimTale.topic.mainID = mID;
    },
    //推送到kindle
    kindle: {
      push: function (isKindleSet, topicID) {
        if (!isKindleSet) {
          FimTale.global.msg(translate('Kindle_Not_Set'));
          return;
        }
        FimTale.global.msg(translate('Kindle_Pushing'));
        $.ajax({
          url: WebsitePath + '/export/mobi/' + topicID + '?pushToKindle',
          success: function (data) {
            FimTale.global.msg(translate(data));
          },
          error: function (res) {
            FimTale.global.msg(translate('Network_Error'));
          }
        });
      }
    },
    //阅读进度操作
    readingProgress: {
      //进度
      val: 0,
      //初始化
      init: function (progress) {
        FimTale.topic.readingProgress.val = progress;
        FimTale.topic.readingProgress.setScrollBar();
        window.onbeforeunload = function () {
          FimTale.topic.readingProgress.save(FimTale.topic.topicID);
        };
        $(document).ready(function () {
          setInterval(FimTale.topic.readingProgress.save(FimTale.topic.topicID), 10000);
          $('#progress-setter').on('input change', function () {
            FimTale.topic.readingProgress.restore($(this).val() / 10000);
          });
          $('#progress-setter').parent().find('.thumb').css('display', 'none');
        });
      },
      //设置顶部阅读进度滚动条
      setScrollBar: function () {
        var scroll = function () {
          var rawProgress = FimTale.topic.readingProgress.get(), progress = Math.max(0, Math.min(1, rawProgress));
          $('#progress-cursor').css({
            'width': 'calc(' + (progress) + ' * ( 100% - 14px ) )'
          });
          $('#progress-setter').val(parseInt(progress * 10000));
          if ($(window).scrollTop() + $(window).height() / 2 > $('.passage').offset().top + $('.passage').outerHeight(true) + 64) {
            $('#progress-container').hide();
          } else {
            $('#progress-container').show();
          }
        }
        scroll();
        $(window).scroll(function () {
          scroll();
        }).resize(function () {
          scroll();
        });
      },
      //获取当前阅读进度
      get: function () {
        var currentScroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        var actualTop = $('.passage').offset().top;
        var actualHeight = $('.passage').outerHeight(true);
        return (currentScroll + 15 - actualTop + windowHeight / 2) / actualHeight;
      },
      //恢复阅读进度
      restore: function (val) {
        if (val != null) FimTale.topic.readingProgress.val = val;
        var actualTop = $('.passage').offset().top;
        var actualHeight = $('.passage').outerHeight(true);
        var windowHeight = $(window).height();
        window.scrollTo({"top": actualTop + FimTale.topic.readingProgress.val * actualHeight - windowHeight / 2 - 15});
      },
      //储存阅读进度
      save: function () {
        var progress = Math.max(FimTale.topic.readingProgress.get(), 0),
          args = FimTale.global.getQueryStringArgs(),
          from = args['from'] || '';
        $.post("/save-reading-progress?PostID=" + FimTale.topic.postID + "&Progress=" + progress + "&PreviousRoute=" + from);
        console.log(translate('Reading_Progress_Saved', {"Date": FimTale.global.getDateInfo().str}));
        FimTale.topic.readingProgress.val = progress;
      }
    },
    //HighPraise：作品读者对作品作者的奖励
    highPraise: function (id, isDoubled) {
      layer.confirm(translate('HighPraise_Num_Notice', {"Num": isDoubled ? 2 : 1}) + translate('HighPraise_Desc'), {
          btn: [translate('Give'), translate('Quit')],
          title: 'HighPraise'
        },
        function (index) {
          var text = (isDoubled ? 'DoubleHighPraise' : 'HighPraise');
          FimTale.global.syncBtn($('.highPraise-status'), $('.highPraise-result'), $('.highPraise-number'), 'star', 'orange', isDoubled ? 2 : 1);
          FimTale.manage(id, 1, text, null, '.highPraise-result');
          $('.highPraise-container').each(function () {
            var instance = M.Dropdown.getInstance($(this));
            if (instance && instance.destroy) instance.destroy();
            $(this).removeAttr('onclick');
          });
          layer.close(index);
        }, null);
    },
    //StarHonor：作品作者对作品评论者的奖励
    starHonor: function (id) {
      layer.confirm(translate('StarHonor_Desc'), {
          btn: [translate('Give'), translate('Quit')],
          title: 'StarHonor'
        },
        function (index) {
          FimTale.manage(id, 2, 'StarHonor', null, '#starHonor-' + id);
          $('#starHonor-' + id).removeAttr('onclick');
          layer.close(index);
        }, null);
    },
    //推荐（需要小编资格）
    recommend: {
      //将列出来的标签添加到推荐语中
      addChip: function (str) {
        $('#RecommendReason').insertContent(str);
      },
      //寄出推荐语
      recommend: function (TopicID) {
        FimTale.manageActive({
          ID: TopicID,
          Type: 1,
          Action: 'Recommend',
          Content: $("#RecommendReason").val()
        }, function (Data) {
          FimTale.global.msg(Data.Message);
          location.reload();
        });
      },
      //删除推荐语
      remove: function (RecommendID, TopicID, Recommender) {
        Recommender = Recommender || '';
        FimTale.global.confirm(translate('Confirm'), translate('Delete_Recommend_Word_Confirm', {"Name": Recommender}), function () {
          FimTale.manageActive({
            ID: RecommendID,
            Type: 9,
            Action: 'DeleteRecommendation',
            TopicID: TopicID
          }, function (Data) {
            FimTale.global.msg(Data.Message);
            location.reload();
          });
        });
      }
    },
    //对评论的操作
    comment: {
      delete: function (id, isPerm) {
        FimTale.manageActive({
          ID: id,
          Type: 2,
          Action: (isPerm ? 'Permanently' : '') + 'Delete'
        }, function (Data) {
          FimTale.global.msg(Data.Message);
          location.reload();
        });
      }
    },
    //章节调序
    swapChapterOrder: function (CurrentTopicID, TargetTopicID, success) {
      success = success || function (Data) {
        FimTale.global.msg(translate('Action_Complete', {"Action": translate("Move")}));
        location.reload();
      };
      FimTale.manageActive({
        ID: CurrentTopicID,
        Type: 1,
        Action: 'SwapChapterOrder',
        TargetTopicID: TargetTopicID
      }, success);
    },
    //作品卡片视差效果
    coverParallax: function (target) {
      var self = $(target), parent = self.parent(), locate = function () {
        var selfHeight = self.innerHeight(), parentHeight = parent.innerHeight(),
          position = (parent.offset().top + parentHeight / 2 - $(window).scrollTop()) / Math.max($(window).height(), 1);
        if (selfHeight > parentHeight && position >= 0 && position <= 1) {
          self.css('top', ((parentHeight - selfHeight) * position) + 'px');
        }
      };
      locate();
      $(window).scroll(locate).resize(locate);
    }
  },
  //博客部分
  blog: {
    open: function (uid, desc, callback) {
      layer.confirm(desc, {
        btn: [translate('Confirm_After_Understood'), translate('Quit')],
        title: translate('Open_Blog')
      }, function (index) {
        FimTale.manage(uid, 3, 'OpenBlog', null, function (loading, success, res) {
          callback(loading, success, res);
        });
        layer.close(index);
      }, null);
    },
    id: null,
    //ajax提交更改
    submitChange: function (action, content, success) {
      FimTale.manageActive({
        ID: FimTale.blog.id,
        Type: 9,
        Action: 'Blog',
        Subaction: action,
        Content: content
      }, success);
    },
    //改变状态（删除、恢复）
    toggleStatus: function (action) {
      FimTale.global.confirm(translate('Confirm'), translate('Confirm_Action', {"Action": translate(action.toLowerCase() === 'delete' ? 'Delete' : 'Recover')}), function () {
        FimTale.blog.submitChange(action, null, function () {
          location.reload();
        });
      });
    },
  },
  //通知部分
  notifications: {
    //ajax后loadMore中显示的结果集
    notiStatus: {
      loading: '<i class="material-icons">&#xe5d3;</i> ' + translate('Loading'),
      failToLoad: '<i class="material-icons">&#xe14c;</i> ' + translate('Load_Failed'),
      canLoadMore: '<i class="material-icons">&#xe5cf;</i> ' + translate('Swipe_To_Load'),
      pressToLoadMore: '<i class="material-icons">&#xe5cf;</i> ' + translate('Tap_To_Load'),
      cannotLoadMore: '<i class="material-icons">&#xe876;</i> ' + translate('All_Shown')
    },
    //通过ajax刷新通知界面
    loadMore: function (conf, forceToShow) {
      if (forceToShow || (conf['list'].is(":visible") && conf['loading'].val() !== "1")) {
        conf['loading'].val("1");
        conf['loadmore'].html(FimTale.notifications.notiStatus.loading);
        $.ajax({
          url: WebsitePath + '/notifications/' + conf['type'],
          data: {
            'page': conf['page'].val(),
            'FormHash': FormHash,
          },
          type: 'GET',
          dataType: 'json',
          success: function (Result) {
            conf['loading'].val("0");
            if (Result.Status === 1) {
              var Template = conf['template'].html(),
                get = FimTale.global.renderTemplate(Template, Result[conf['resultArray']]);
              conf['list'].append((typeof conf['contentProcess'] == 'function') ? conf['contentProcess'](get) : get);
              conf['page'].val(parseInt(conf['page'].val()) + 1);
              conf['loadmore'].html(FimTale.notifications.notiStatus.canLoadMore);
              if (Result[conf['resultArray']].length === 0) {
                conf['loading'].val("1");
                conf['loadmore'].html(FimTale.notifications.notiStatus.cannotLoadMore);
              }
              if (typeof conf['callback'] == 'function') conf['callback'](Result);
            } else {
              conf['loadmore'].html(FimTale.notifications.notiStatus.failToLoad);
            }
          },
          error: function (err) {
            conf['loading'].val("0");
            conf['loadmore'].html(FimTale.notifications.notiStatus.failToLoad);
            console.log(err.responseText);
          }
        });
      }
    },
    //加载更多互动内容
    loadMoreInteraction: function (forceToShow) {
      FimTale.notifications.loadMore({
        type: 'interaction',
        list: $("#InteractionList"),
        page: $("#InteractionPage"),
        template: $("#InteractionPostTemplate"),
        resultArray: 'InteractionArray',
        loading: $("#InteractionLoading"),
        loadmore: $("#InteractionLoadMore"),
        contentProcess: function (str) {
          return FTEmoji.toFTEmoji(emojione.toImage(str));
        }
      }, forceToShow);
    },
    //加载更多回复内容
    loadMoreReply: function (forceToShow) {
      FimTale.notifications.loadMore({
        type: 'reply',
        list: $("#RepliedToMeList"),
        page: $("#RepliedToMePage"),
        template: $("#RepliedToMePostTemplate"),
        resultArray: 'ReplyArray',
        loading: $("#RepliedToMeLoading"),
        loadmore: $("#RepliedToMeLoadMore"),
        contentProcess: function (str) {
          return FTEmoji.toFTEmoji(emojione.toImage(str));
        }
      }, forceToShow);
    },
    //加载更多提到内容
    loadMoreMention: function (forceToShow) {
      FimTale.notifications.loadMore({
        type: 'mention',
        list: $("#MentionedMeList"),
        page: $("#MentionedMePage"),
        template: $("#MentionedMePostTemplate"),
        resultArray: 'MentionArray',
        loading: $("#MentionedMeLoading"),
        loadmore: $("#MentionedMeLoadMore"),
        contentProcess: function (str) {
          return FTEmoji.toFTEmoji(emojione.toImage(str));
        }
      }, forceToShow);
    },
    //加载更多对话列表
    loadMoreInbox: function (forceToShow) {
      FimTale.notifications.loadMore({
        type: 'inbox',
        list: $("#InboxList"),
        page: $("#InboxPage"),
        template: $("#InboxTemplate"),
        resultArray: 'InboxArray',
        loading: $("#InboxLoading"),
        loadmore: $("#InboxLoadMore"),
        contentProcess: function (str) {
          return str.replace(/\!\[(.*)\]\((.+)\)/g, "[" + translate('Image') + "]");
        }
      }, forceToShow);
    },
    //加载更多动态内容
    loadMoreUpdates: function (forceToShow, callback) {
      callback = callback || null;
      FimTale.notifications.loadMore({
        type: 'updates',
        list: $("#UpdateList"),
        page: $("#UpdatesPage"),
        template: $("#UpdatesPostTemplate"),
        resultArray: 'UpdateArray',
        loading: $("#UpdatesLoading"),
        loadmore: $('#UpdatesLoadMore'),
        contentProcess: function (str) {
          return FTEmoji.toFTEmoji(emojione.toImage(str));
        },
        callback: function (res) {
          callback(res);
        }
      }, forceToShow);
    },
    //加载更多管理信息
    loadMoreReports: function (forceToShow) {
      FimTale.notifications.loadMore({
        type: 'reports',
        list: $("#ReportList"),
        page: $("#ReportsPage"),
        template: $("#ReportsTemplate"),
        resultArray: 'ReportArray',
        loading: $("#ReportsLoading"),
        loadmore: $('#ReportsLoadMore'),
        contentProcess: function (str) {
          return FTEmoji.toFTEmoji(emojione.toImage(str));
        },
        callback: function (res) {
          $('#ReportList img:not(.materialboxed):not(.emojione):not(.ftemoji)').each(function () {
            if (M) $(this).addClass('materialboxed').materialbox();
          });
        }
      }, forceToShow);
    }
  },
  //对话部分
  inbox: {
    id: 0,
    interval: null,
    requertSpan: 60000,
    hiddenRequestCounter: 0,
    //初始化对话界面
    init: function (id) {
      FimTale.inbox.id = id;
      FimTale.inbox.loadMoreMessages(true);
      FimTale.inbox.interval = setInterval(function () {
        if (document.hidden) FimTale.inbox.hiddenRequestCounter++;
        if (FimTale.inbox.hiddenRequestCounter < 15) FimTale.inbox.askForNew();
      }, FimTale.inbox.requertSpan);
      $("#MessageList").scroll(function () {
        if ($(this).scrollTop() < 20) {
          var totalHeight = 0,
            totalNum = 0;
          $(this).children().each(function () {
            totalHeight += $(this).outerHeight(true);
            totalNum++;
          });
          if (totalHeight > $(this).innerHeight() || totalNum > 10) FimTale.inbox.loadMoreMessages(false);
        }
      });
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) {
          $('title').text($('title').text().replace(translate('New_Inbox_Num_Reg'), ''));
          FimTale.inbox.hiddenRequestCounter = 0;
        }
      });
    },
    updateDateLabel: function (showAllDate) {
      var today = parseInt(FimTale.global.date('Ymd')), tempDate = 0, tempTime = 0;
      $("#MessageList").find('.message-time-label').remove();
      $("#MessageList").children().each(function () {
        var thisTimeStamp = parseInt($(this).attr('data-timestamp')) * 1000,
          thisDate = parseInt(FimTale.global.date('Ymd', thisTimeStamp)),
          thisTime = parseInt(FimTale.global.date('His', thisTimeStamp)),
          str = '',
          showLabel = false;
        if (thisDate > tempDate) tempTime -= 240000;
        if (thisDate < today) str = str + FimTale.global.date(translate((parseInt(FimTale.global.date('Y', thisTimeStamp)) !== parseInt(FimTale.global.date('Y')) ? 'Year_' : '') + 'Month_Day'), thisTimeStamp) + ' ';
        tempDate = thisDate;
        str = str + FimTale.global.date('H:i:s', thisTimeStamp);
        if (thisTime > tempTime + 300 || showAllDate) {
          showLabel = true;
          tempTime = thisTime;
        }
        if (showLabel) $(this).before('<div class="message-time-label message-notify grey-text center">' + str + '</div>');
      });
    },
    updateImageBubble: function () {
      $('.message-bubble:not(.transparent):not(.picture)').each(function () {
        if ($(this).children().length == 1 && $(this).children('.share-item').length) $(this).addClass('transparent');
        if ($(this).children().length && !$(this).children(':not(img),.emojione,.ftemoji').length) $(this).addClass('picture').find('img:not(.emojione):not(.ftemoji)').addClass('materialboxed').materialbox();
      });
    },
    //插入信息
    insertMessages: function (newMessages) {
      var tempDiv = $('<div></div>');
      tempDiv.html(newMessages);
      tempDiv.children().each(function () {
        var thisID = parseInt($(this).attr('data-id')),
          node = this.outerHTML,
          tempID = -1,
          isInserted = false;
        $("#MessageList").children().each(function () {
          var bubbleID = parseInt($(this).attr('data-id'));
          if (isNaN(bubbleID)) return true;
          if (thisID == bubbleID) {
            isInserted = true;
            return false;
          } else if (thisID < bubbleID && thisID > tempID) {
            $(this).before(node);
            isInserted = true;
            return false;
          } else {
            tempID = bubbleID;
          }
        });
        if (!isInserted) $("#MessageList").append(node);
      });
    },
    insertMessagesByArray: function (messageArr) {
      var Template = $("#MessageTemplate").html(),
        MessageList = $("#MessageList"),
        isBottom = (!MessageList.children().length || MessageList.scrollTop() == MessageList.prop("scrollHeight"));
      FimTale.inbox.insertMessages(FTEmoji.toFTEmoji(emojione.toImage(FimTale.global.renderTemplate(Template, messageArr).replace(/\!\[(.*)\]\((.+)\)/g, "<img src=\"" + "$2" + "\" title=\"" + "$1" + "\" loading=\"lazy\"/>"))));
      FimTale.inbox.updateDateLabel(false);
      FimTale.inbox.updateImageBubble();
      renderShareCards($(".share-item:not(.rendered)"));
      if (isBottom) MessageList.scrollTop(MessageList.prop("scrollHeight"));
    },
    //加载更多对话内容
    loadMoreMessages: function (forceToShow) {
      var MessageList = $("#MessageList");
      var InboxID = $("#InboxID").val();
      var MessagesLastDate = $("#MessagesLastDate");
      var MessagesLoading = $("#MessagesLoading");
      if (forceToShow || MessagesLoading.val() !== "1") {
        MessagesLoading.val("1");
        $.ajax({
          url: WebsitePath + '/inbox/' + InboxID + '/list',
          data: {
            'last_date': MessagesLastDate.val(),
            'FormHash': FormHash
          },
          type: 'GET',
          dataType: 'json',
          success: function (Result) {
            MessagesLoading.val("0");
            if (Result.Status === 1) {
              if (Result.MessageArray.length) MessagesLastDate.val(Result.MessageArray[0].Time);
              FimTale.inbox.insertMessagesByArray(Result.MessageArray);
              if (Result.MessageArray.length === 0) {
                MessagesLoading.val("1");
              }
            }
          },
          error: function (err) {
            MessagesLoading.val("0");
            console.log(err.responseText);
          }
        });
      }
    },
    //刷新
    reload: function () {
      $("#MessageList").html('');
      $("#MessagesLastDate").val(Math.floor(new Date().getTime() / 1000) + 1);
      FimTale.inbox.loadMoreMessages(true);
      clearInterval(FimTale.inbox.interval);
      FimTale.inbox.interval = setInterval(function () {
        if (document.hidden) FimTale.inbox.hiddenRequestCounter++;
        if (FimTale.inbox.hiddenRequestCounter < 15) FimTale.inbox.askForNew();
      }, FimTale.inbox.requertSpan);
    },
    //检查消息列表并且加入消息
    refreshLastSeen: function (lastseen) {
      if (lastseen && Math.floor(new Date().getTime() / 1000) - lastseen < 300) {
        text = '<span class="green-text">' + translate('Online') + '</span>';
      } else {
        text = '<span class="red-text">' + translate('Offline') + '</span> ' + translate('Last_Time_Online') + ': ' + FimTale.global.formatDate(lastseen);
      }
      $('.lastseen').html(text);
    },
    addNew: function () {
      var tempDialogInfo = FimTale.global.getLocalStorage('inbox_status'),
        tempMessageArr = FimTale.global.getLocalStorage('inbox_messages_temp'),
        res = [],
        newList = [];
      if (!tempDialogInfo) tempDialogInfo = [];
      for (var k in tempDialogInfo) {
        if (tempDialogInfo[k]['ID']) {
          FimTale.inbox.refreshLastSeen(tempDialogInfo[k]['Lastseen']);
        }
      }
      if (!tempMessageArr) tempMessageArr = [];
      for (var i = 0; i < tempMessageArr.length; i++) {
        if (tempMessageArr[i]['InboxID'] == FimTale.inbox.id) {
          if (!$('#message-' + tempMessageArr[i]['ID']).length) {
            res.push(tempMessageArr[i]);
            newList.push(tempMessageArr[i]);
          }
        } else {
          newList.push(tempMessageArr[i]);
        }
      }
      FimTale.global.setLocalStorage('inbox_messages_temp', newList);
      FimTale.inbox.insertMessagesByArray(res);
      if (res.length) {
        if (document.hidden) {
          $('title').text($('title').text().replace(translate('New_Inbox_Num_Reg'), function (a, b, c, d) {
            var oldNum = c ? parseInt(c) : 0;
            return translate('New_Inbox_Num', {"Num": oldNum + res.length}) + d;
          }));
        } else if ($('#MessageList').children().length > 5 && $('#MessageList').scrollTop() < $('#MessageList').prop("scrollHeight") - 1000) {
          FimTale.global.msg('New_Inbox_Notice', {"Num": res.length});
        } else {
          $('#MessageList').scrollTop($('#MessageList').prop("scrollHeight"));
        }
      }
    },
    //向服务器请求新消息
    askForNew: function () {
      var timeStamp = new Date().getTime(),
        tempInboxQueue = FimTale.global.getLocalStorage('inbox_queue_info');
      if (!tempInboxQueue) tempInboxQueue = {};
      if (!tempInboxQueue['IDs']) tempInboxQueue['IDs'] = [];
      if (!tempInboxQueue['TimeStamp'] || tempInboxQueue['TimeStamp'] <= timeStamp - FimTale.inbox.requertSpan) {
        if (!(FimTale.inbox.id in tempInboxQueue['IDs'])) tempInboxQueue['IDs'].push(FimTale.inbox.id);
        $.ajax({
          url: WebsitePath + '/inbox/new',
          data: {
            'inbox_ids': tempInboxQueue['IDs'].join(','),
            'last_date': tempInboxQueue['TimeStamp'] ? Math.floor(tempInboxQueue['TimeStamp'] / 1000) : '',
            'FormHash': FormHash
          },
          type: 'GET',
          dataType: 'json',
          beforeSend: function (xhr) {
            console.log('request sent at ' + timeStamp);
          },
          success: function (Result) {
            if (Result.Status === 1) {
              var tempMessageArr = FimTale.global.getLocalStorage('inbox_messages_temp');
              if (!tempMessageArr) tempMessageArr = [];
              tempMessageArr = tempMessageArr.concat(Result.MessagesArray);
              FimTale.global.setLocalStorage('inbox_messages_temp', tempMessageArr);
              FimTale.global.setLocalStorage('inbox_status', Result.DialogInfo);
            }
            FimTale.inbox.addNew();
          },
          error: function () {
            FimTale.inbox.addNew();
          }
        });
        tempInboxQueue['TimeStamp'] = timeStamp;
        tempInboxQueue['IDs'] = [];
        FimTale.global.setLocalStorage('inbox_queue_info', tempInboxQueue);
      } else {
        if (!FimTale.inbox.id in tempInboxQueue['IDs']) tempInboxQueue['IDs'].push(FimTale.inbox.id);
        FimTale.global.setLocalStorage('inbox_queue_info', tempInboxQueue);
        FimTale.inbox.addNew();
      }
    },
    //发送对话
    submit: function (content, data) {
      data = data || {tencentCode: null, tencentRand: null, toast: true};
      if (!content) {
        FimTale.global.msg(translate('Object_Cannot_Be_Empty', {"Object": translate('Message')}));
        return;
      }
      if (data.toast) FimTale.global.msg(translate('Message_Sending'));
      $("#SendMessageButton").val('……').attr("disabled", true);
      $.ajax({
        url: WebsitePath + '/inbox/' + $('#InboxID').val(),
        type: 'POST',
        data: {
          Content: content,
          tencentCode: data.tencentCode,
          tencentRand: data.tencentRand
        },
        dataType: 'json',
        success: function (Result) {
          $("#SendMessageButton").attr("disabled", false);
          if (Result.Status === 1) {
            FimTale.global.msg(Result.MessageArr && Result.MessageArr.length && Result.MessageArr[0].IsBlocked ? translate('You_Have_Been_Blocked') : translate('Action_Complete', {"Action": translate('Send')}));
            FimTale.inbox.insertMessagesByArray(Result.MessageArr);
            $("#MessageList").scrollTop($("#MessageList").prop("scrollHeight"));
            $('#MessageContent').val('');
          } else {
            if (Result.ErrorMessage === translate('Need_Captcha') && data.toast) {
              FimTale.global.fetchTencentCaptcha(function (res) {
                FimTale.inbox.submit(content, {
                  tencentCode: res.ticket,
                  tencentRand: res.randstr,
                  toast: false
                });
              });
            } else {
              FimTale.global.confirm(translate('Action_Failed', {"Action": translate('Send')}), translate('Action_Failed', {"Action": translate('Send')}) + ', ' + translate('Feedback_Confirm'), function () {
                FimTale.report.addReasonWithTarget('system', 0, JSON.stringify(Result));
              });
            }
          }
        },
        error: function (err) {
          $("#SendMessageButton").attr("disabled", false);
          FimTale.global.confirm(translate('Action_Failed', {"Action": translate('Send')}), translate('Action_Failed', {"Action": translate('Send')}) + ', ' + translate('Feedback_Confirm'), function () {
            FimTale.report.addReasonWithTarget('system', 0, err.responseText);
          });
          console.log(err.responseText);
          $("#SendMessageButton").val(translate('Send_Again'));
        }
      });
    }
  },
  //标签部分
  tag: {
    //更新标签名
    submitTagName: function (TagID) {
      FimTale.manageActive({
        ID: TagID,
        Type: 5,
        Action: 'EditName',
        Name: $("#TagNameInput").val()
      }, function (Data) {
        window.location.href = Data.Message;
      });
    },
    //更新描述
    submitTagDescription: function (TagID) {
      FimTale.manageActive({
        ID: TagID,
        Type: 5,
        Action: 'EditDescription',
        Content: $("#TagDescriptionInput").val()
      }, function (Data) {
        $(".tag-description").html(Data.Content);
      });
    },
    //获得标签组标签
    getChips: function (selector) {
      var rawChips = M.Chips.getInstance(selector).chipsData,
        res = [];
      for (var c in rawChips) {
        res.push(rawChips[c].tag);
      }
      return res;
    },
    //清除selector标签下的所有标签
    clearChips: function (selector) {
      var instance = M.Chips.getInstance(selector);
      while (instance.chipsData.length > 0) {
        instance.deleteChip();
      }
    }
  },
  //频道
  channel: {
    id: null,
    //创建频道
    create: function (ID, name, description) {
      FimTale.global.fetchTencentCaptcha(function (res) {
        FimTale.manageActive({
          ID: ID,
          Type: 9,
          Action: 'CreateChannel',
          Name: name,
          Description: description,
          tencentCode: res.ticket,
          tencentRand: res.randstr
        }, function (Data) {
          window.location.href = Data.Message;
        });
      });
    },
    //ajax提交更改
    submitChange: function (action, content, success) {
      FimTale.manageActive({
        ID: FimTale.channel.id,
        Type: 9,
        Action: 'Channel',
        Subaction: action,
        Content: content
      }, success);
    },
    //编辑标题/简介
    edit: function (content, type) {
      var action = 'edit' + type,
        container = $('.channel-' + type.toLowerCase());
      FimTale.channel.submitChange(action, content, function (Data) {
        container.html(Data.Message);
      });
    },
    //上传封面图
    uploadCover: function (url, success) {
      FimTale.channel.submitChange('uploadCover', url, success);
    },
    //改变状态（删除、恢复）
    toggleStatus: function (action) {
      FimTale.global.confirm(translate('Confirm'), translate('Confirm_Action', {"Action": translate(action.toLowerCase() === 'delete' ? 'Delete' : 'Recover')}), function () {
        FimTale.channel.submitChange(action, null, function () {
          location.reload();
        });
      });
    },
    //收藏进频道
    collect: function (topicID, success, folder) {
      folder = folder || '';
      FimTale.channel.submitChange('collect', JSON.stringify({
        topicID: topicID,
        targetFolder: folder
      }), success);
    },
    setTop: function (topicID, success) {
      FimTale.channel.submitChange('setTop', topicID, success);
    },
  },
  //评论
  comment: {
    //ajax提交更改
    submitChange: function (id, action, content, success) {
      FimTale.manageActive({
        ID: id,
        Type: 9,
        Action: 'Comment',
        Subaction: action,
        Content: content
      }, success);
    },
    collect: function (id, category, targetContainer) {
      FimTale.manageActive({
        ID: id,
        Type: 4,
        Action: 4,
        Category: category
      }, function (res) {
        if (res.Message.indexOf(translate('Fav_Symbol')) >= 0) {
          if (!$(targetContainer).hasClass('light-blue-text')) $(targetContainer).addClass('light-blue-text').addClass('text-lighten-2');
        } else {
          if ($(targetContainer).hasClass('light-blue-text')) $(targetContainer).removeClass('light-blue-text').removeClass('text-lighten-2');
        }
      });
    },
    //删评
    delete: function (id, isPerm) {
      FimTale.comment.submitChange(id, 'delete', (isPerm ? '1' : '0'), function (res) {
        FimTale.global.msg(res.Message);
        location.reload();
      });
    },
    //锁定评论
    lock: function (id, type) {
      FimTale.global.confirm(translate('Confirm'), translate('Confirm_Action', {"Action": translate('Lock') + '/' + translate('Unlock')}), function () {
        FimTale.manageActive({
          ID: id,
          Type: 9,
          Action: type,
          Subaction: 'lock'
        }, function (res) {
          location.reload();
        });
      });
    },
    //聚焦
    focus: function () {
      var target = $(tinymce.get('editor').targetElm);
      target.show();
      $("html,body").animate({scrollTop: target.offset().top - 100}, 300);
      target.hide();
    },
    //回复评论
    reply: function (type, mainID, commentID, UserName) {
      tinymce.get('editor').setContent('<p>&lt;&lt;' + type + '-' + mainID + '-' + commentID + '&nbsp;@' + UserName + '&nbsp;</p>' + (tinymce.get('editor').getContent().length ? tinymce.get('editor').getContent() : '<p></p>'));
      FimTale.comment.focus();
    }
  },
  //translate('Confirm') + '?'
  report: {
    //类型
    target: null,
    appendedMessage: '',
    //填写举报理由
    fillText: function (heading, appendix) {
      $('.report-headings').html(heading);
      $('.report-appendix').html(appendix);
    },
    addReason: function (ID, appendedMessage) {
      $('#ReportID').val(ID);
      $("#ReportReason").val('');
      if (appendedMessage == null) appendedMessage = '';
      FimTale.report.appendedMessage = appendedMessage.replace(/<br[^>]*>/g, '\n\n').replace(/<[^>]*>/g, '').replace(/\n+/g, '\n\n');
      FimTale.report.images.init();
      switch (FimTale.report.target) {
        case 'system':
          FimTale.report.appendedMessage = (appendedMessage ? '报错信息为：\n\n```' + appendedMessage + '\n\n```\n\n ' : '') + '此时地址为：[' + window.location.href + '](' + window.location.href + ')';
          FimTale.report.fillText(translate('Feedback_Title'), translate('Feedback_Desc') + (appendedMessage ? translate('Feedback_Error_Code', {"Code": appendedMessage}) : '') + '</p>');
          break;
        default:
          FimTale.report.fillText(translate('Report_Title'), translate('Report_Desc'));
          break;
      }
      $('#Report').modal('open');
    },
    addReasonWithTarget: function (Target, ID, appendedMessage) {
      FimTale.report.target = Target;
      FimTale.report.addReason(ID, appendedMessage);
    },
    images: {
      queue: [],
      init: function () {
        if (!$('#report-image-upload').length) {
          $('.report-image-queue').after('<input id="report-image-upload" type="file" accept="image/*" style="display: none;">');
          $('#report-image-upload').change(function () {
            FimTale.report.images.upload(this);
          });
        }
        FimTale.report.images.display();
      },
      upload: function (obj) {
        var f = obj.files[0], n = f.name, t = f.type;
        FimTale.global.imageCrop(f, function (image) {
          var imageFile = new File([image], n, {type: t});
          FimTale.global.msg(translate('Uploading'));
          $('#report-image-upload-progress-container').show();
          $('#report-image-upload-progress').css('width', 0);
          FimTale.editor.tools.imageUpload(imageFile, function (url) {
            $(obj).val('');
            $('#report-image-upload-progress-container').hide();
            FimTale.global.msg(translate('Action_Complete', {"Action": 'Upload'}));
            FimTale.report.images.addToQueue(url);
          }, function (err) {
            $('#report-image-upload-progress-container').hide();
            FimTale.global.msg(translate('Action_Failed', {"Action": 'Upload'}));
          }, function (e) {
            $('#report-image-upload-progress').css('width', (e.loaded / e.total * 100) + '%');
          });
        }, {
          ready: function () {
            var cropper = this.cropper, containerData = cropper.getImageData();
            cropper.setCropBoxData({
              left: 0,
              top: 0,
              width: containerData.width,
              height: containerData.height
            });
          }
        });
      },
      display: function () {
        var container = $('.report-image-queue'),
          text = '';
        for (var i in FimTale.report.images.queue) {
          text = text + '<div class="report-images-container"><div class="report-image-cover"><img class="report-image" src="' + FimTale.report.images.queue[i] + '" loading="lazy"></div><div class="report-image-remove" onclick="FimTale.report.images.removeFromQueue(' + i + ')"><i class="material-icons">&#xe5cd;</i></div></div>';
        }
        if (FimTale.report.images.queue.length < 3) {
          text = text + '<div id="report-images-add" class="report-images-container"><i class="material-icons">&#xe145;</i></div>';
        }
        container.html(text);
        if (FimTale.report.images.queue.length < 3) {
          $('#report-images-add').click(function () {
            $('#report-image-upload').click();
          });
        }
      },
      addToQueue: function (url) {
        if (!(url in FimTale.report.images.queue)) FimTale.report.images.queue.push(url);
        FimTale.report.images.display();
      },
      removeFromQueue: function (ord) {
        FimTale.report.images.queue.splice(ord, 1);
        FimTale.report.images.display();
      },
      clearQueue: function () {
        FimTale.report.images.queue = [];
        FimTale.report.images.display();
      }
    },
    //发送举报信息
    report: function () {
      if (FimTale.report.target != null) {
        FimTale.manageActive({
          ID: parseInt($("#ReportID").val()),
          Type: 9,
          Action: 'Report',
          Target: FimTale.report.target,
          Content: $("#ReportReason").val(),
          AppendedMessage: FimTale.report.appendedMessage,
          Images: JSON.stringify(FimTale.report.images.queue)
        }, function (Data) {
          if (Data.Status === 1) {
            FimTale.global.msg(Data.Message);
            $("#ReportReason").val('');
            FimTale.report.images.clearQueue();
          } else {
            FimTale.global.msg(Data.ErrorMessage);
          }
        });
      }
    },
    //发送系统消息
    systemMessage: function (content, userNames) {
      userNames = userNames || [];
      FimTale.manageActive({
        ID: FimTale.curUserID,
        Type: 9,
        Action: 'SendSystemMessage',
        Content: content,
        UserList: JSON.stringify(userNames)
      }, function (Data) {
        if (Data.Status === 1) {
          FimTale.global.msg(Data.Message);
          $("#SystemMessage").val('');
        } else {
          FimTale.global.msg(Data.ErrorMessage);
        }
      });
    }
  },
  //评价
  rate: function (actionID, id, type) {
    var manage = {'upvote': 6, 'downvote': 7},
      actionCode = ["topic", "tag", "user", "comment", "blogpost", "channel", "comment"];
    if (type === 'upvote' || type === 'downvote') {
      var className = actionCode[actionID - 1] + "-" + id;
      $('.upvote-btn.' + className + ',.downvote-btn.' + className).addClass('disabled');
      $('.upvote-icon.' + className + ',.downvote-icon.' + className).html('&#xe5d3;');
      FimTale.global.msg(translate('Request_Sending_Please_Wait'));
      FimTale.manageActive({
        "ID": id,
        "Type": manage[type],
        "Action": actionID
      }, function (res) {
        FimTale.global.msg(translate('Action_Complete', {'Action': translate(res.Message.CurAction == 'upvote' ? 'Upvote' : (res.Message.CurAction == 'downvote' ? 'Downvote' : 'Cancel'))}));
        $('.upvote-btn.' + className + ',.downvote-btn.' + className).removeClass('disabled');
        $('.upvote-icon.' + className).html('&#xe8dc;');
        $('.downvote-icon.' + className).html('&#xe8db;');
        FimTale.global.refreshVote(className, res.Message);
      });
    }
  },
  //收藏
  favorite: {
    type: 0,
    id: 0,
    selector: null,
    folders: {},
    curFolders: null,
    isFolderLoaded: false,
    addFolderCallback: null,
    renameFolderCallback: null,
    openAddFolderModal: function (callback) {
      FimTale.favorite.addFolderCallback = callback;
      if (!$("#new-favorite-folder").length) {
        $("body").append('<div id="new-favorite-folder" class="modal modal-fixed-footer"><div class="modal-content"><div class="page-subtitle by-theme-text">' + translate('Add_Collection_Folder') + '</div><div class="input-field"><input id="fav-folder-name" type="text" class="validate"><label for="fav-folder-name">' + translate('Folder_Name') + '</label></div><div class="helper-text">' + translate('Folder_Name_Desc') + '</div></div><div class="modal-footer"><a class="btn-flat waves-effect waves-light modal-close" onclick="FimTale.favorite.addFolder();">' + translate('Submit') + '</a><a class="btn-flat waves-effect waves-light modal-close">' + translate('Quit') + '</a></div></div>');
        $("#new-favorite-folder").modal();
      }
      $("#new-favorite-folder").modal('open');
    },
    openRenameFolderModal: function (oldName, callback) {
      FimTale.favorite.renameFolderCallback = callback;
      if (!$("#rename-favorite-folder").length) {
        $("body").append('<div id="rename-favorite-folder" class="modal modal-fixed-footer"><div class="modal-content"><div class="page-subtitle by-theme-text">' + translate('Rename_Collection_Folder') + '</div><div class="input-field"><input id="fav-folder-rename" type="text" class="validate"><label for="fav-folder-rename">' + translate('Folder_Name') + '</label></div><div class="helper-text">' + translate('Folder_Name_Desc') + '</div></div><div class="modal-footer"><a class="btn-flat waves-effect waves-light modal-close" onclick="FimTale.favorite.renameFolder(\'' + oldName + '\');">' + translate('Submit') + '</a><a class="btn-flat waves-effect waves-light modal-close">' + translate('Quit') + '</a></div></div>');
        $("#rename-favorite-folder").modal();
      }
      $('#rename-favorite-folder #fav-folder-rename').val(oldName);
      $("#rename-favorite-folder").modal('open');
    },
    addFolder: function () {
      var name = $('#new-favorite-folder #fav-folder-name').val();
      if (!name.length) return;
      FimTale.manageActive({
        ID: 0,
        Type: 9,
        Action: 'Favorite',
        Subaction: 'createFolder',
        Content: name
      }, function (res) {
        FimTale.favorite.folders[name] = {"ID": parseInt(res.Message), "Collections": 0};
        if (FimTale.favorite.addFolderCallback != null) FimTale.favorite.addFolderCallback(res);
      });
    },
    renameFolder: function (oldName) {
      var newName = $('#rename-favorite-folder #fav-folder-rename').val();
      if (!newName.length || newName === oldName) return;
      FimTale.manageActive({
        ID: 0,
        Type: 9,
        Action: 'Favorite',
        Subaction: 'renameFolder',
        Content: JSON.stringify({"OldName": oldName, "NewName": newName})
      }, function (res) {
        newName = res.Message;
        FimTale.favorite.folders[newName] = FimTale.favorite.folders[oldName];
        delete FimTale.favorite.folders[oldName];
        if (FimTale.favorite.renameFolderCallback != null) FimTale.favorite.renameFolderCallback(res);
      });
    },
    removeFolder: function (name, callback) {
      FimTale.global.confirm(translate('Confirm'), translate('Remove_Folder_Confirm', {"Name": name}), function () {
        FimTale.manageActive({
          ID: 0,
          Type: 9,
          Action: 'Favorite',
          Subaction: 'removeFolder',
          Content: name
        }, function (res) {
          delete FimTale.favorite.folders[name];
          if (callback != null) callback(res);
        });
      });
    },
    //显示收藏夹
    showFolders: function (type, id, selector) {
      if (!$("#favorite-folders").length) {
        $("body").append('<div id="favorite-folders" class="modal bottom-sheet modal-fixed-footer"><div class="modal-content"><div class="page-subtitle by-theme-text">' + translate('Select_Collection_Folder') + '<a class="btn-flat waves-effect waves-light right" onclick="FimTale.favorite.openAddFolderModal(function (res) { FimTale.favorite.showItems(); });"><i class="material-icons">&#xe145;</i>' + translate('Add_Collection_Folder') + '</a></div><ul id="folder-list" class="collection no-border"></ul></div><div class="modal-footer"><a class="submit-button btn-flat waves-effect waves-light modal-close" onclick="FimTale.favorite.commitFolders();">' + translate('Collect') + '</a><a class="btn-flat waves-effect waves-light modal-close">返回</a></div></div>');
        $("#favorite-folders").modal();
      }
      if (type !== FimTale.favorite.type || id !== FimTale.favorite.id) {
        FimTale.favorite.type = type;
        FimTale.favorite.id = id;
        FimTale.favorite.isFolderLoaded = false;
      }
      FimTale.favorite.selector = selector;
      if (FimTale.favorite.isFolderLoaded) {
        FimTale.favorite.showItems();
        $("#favorite-folders").modal('open');
      } else {
        FimTale.favorite.folders = {};
        var data = null;
        if (type > 0 && id > 0) {
          data = {"Type": type, "ID": id};
        }
        FimTale.getJson("getMyFavFolders", data, function (res) {
          for (var k in res.Folders) {
            FimTale.favorite.folders[k] = res.Folders[k];
          }
          FimTale.favorite.curFolders = res.CurFolders;
          FimTale.favorite.isFolderLoaded = true;
          FimTale.favorite.showItems();
          $("#favorite-folders").modal('open');
        });
      }
    },
    showItems: function () {
      $('#favorite-folders .submit-button').html(translate('Collect'));
      var html = '<li class="collection-item"><div>(' + translate('Main_Collection_Folder') + ')<span class="secondary-content"><label><input id="main-folder-checkbox" type="checkbox" class="filled-in" checked="checked" onclick="if(!$(this).is(\':checked\')) $(\'.fav-folder-checkbox\').each(function(){$(this).prop(\'checked\', false);});" onchange="$(\'#favorite-folders .submit-button\').html($(this).is(\':checked\')?\'' + translate('Collect') + '\':\'' + translate('Cancel_Collection') + '\');"/><span></span></label></span></div></li>';
      for (var k in FimTale.favorite.folders) {
        var id = FimTale.favorite.folders[k]["ID"];
        html = html + '<li class="collection-item"><div>' + k + '<span class="secondary-content"><label><input type="checkbox" class="fav-folder-checkbox filled-in" value="' + id + '"' + (FimTale.favorite.curFolders != null && FimTale.favorite.curFolders.indexOf(id) >= 0 ? ' checked="checked" data-checked="1"' : ' data-checked="0"') + ' onclick="$(\'#main-folder-checkbox\').prop(\'cheecked\', true);"/><span></span></label></span></div></li>';
      }
      $("#favorite-folders #folder-list").html(html);
    },
    commitFolders: function () {
      var folders = [], isFavorite = $('#main-folder-checkbox').length > 0 && $('#main-folder-checkbox').is(':checked'),
        isChanged = false;
      $(".fav-folder-checkbox").each(function () {
        var originalChecked = (parseInt($(this).attr('data-checked')) === 1), checked = $(this).is(':checked');
        if (checked) folders.push(parseInt($(this).val()));
        if (checked !== originalChecked) isChanged = true;
      });
      if ((FimTale.favorite.curFolders == null && isFavorite) || (FimTale.favorite.curFolders != null && FimTale.favorite.curFolders.length <= 0 && !isFavorite) || isChanged) {
        if (!$('#main-folder-checkbox').is(':checked')) folders = FimTale.favorite.curFolders;
        FimTale.favorite.favorite(folders);
      }
    },
    favorite: function (folders) {
      FimTale.manageActive({
        ID: FimTale.favorite.id,
        Type: 4,
        Action: FimTale.favorite.type,
        Category: folders.join(",")
      }, function (res) {
        FimTale.favorite.curFolders = res.Message.indexOf(translate('Fav_Symbol')) >= 0 ? folders : null;
        if (FimTale.favorite.selector != null) $(FimTale.favorite.selector).html(res.Message);
      });
    }
  },
  //管理
  manage: function (ID, Type, Action, confirmAction, TargetTag) {
    var _this = this, isFunction = (typeof TargetTag == 'function'), isDomElement = function (obj) {
      return typeof HTMLElement === 'object' ? obj instanceof HTMLElement : (obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string');
    }, operate = function () {
      if (isFunction) {
        TargetTag(1, 0, "……");
      } else {
        FimTale.global.msg(translate('Request_Sending_Please_Wait'));
        $(TargetTag).text("……");
      }
      if (isDomElement(_this)) $(_this).addClass('disabled');
      $.ajax({
        url: WebsitePath + "/manage",
        data: {
          ID: ID,
          Type: Type,
          Action: Action
        },
        cache: false,
        dataType: "json",
        type: "POST",
        success: function (Json) {
          if (isDomElement(_this)) $(_this).removeClass('disabled');
          if (Json.Status === 1) {
            FimTale.global.msg(translate('Action_Complete', {"Action": translate('Operation')}));
            if (isFunction) {
              TargetTag(0, 1, Json.Message);
            } else {
              $(TargetTag).html(Json.Message);
            }
          } else {
            FimTale.global.msg(Json.ErrorMessage);
            if (isFunction) TargetTag(0, 0, Json.ErrorMessage);
          }
        },
        error: function (err) {
          if (isDomElement(_this)) $(_this).removeClass('disabled');
          FimTale.global.confirm(translate('Action_Failed', {"Action": confirmAction}), translate('Action_Failed', {"Action": confirmAction}) + ', ' + translate('Feedback_Confirm'), function () {
            FimTale.report.addReasonWithTarget('system', 0, err.responseText);
          });
          console.log(err.responseText);
        }
      });
    };
    if (confirmAction != null) {
      FimTale.global.confirm(translate('Confirm'), translate('Confirm_Action', {'Action': confirmAction}), function () {
        operate();
      });
    } else {
      operate();
    }
  },
  //自定义data的管理
  manageActive: function (data, success, failure) {
    var _this = this, isDomElement = function (obj) {
      return typeof HTMLElement === 'object' ? obj instanceof HTMLElement : (obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string');
    };
    if (isDomElement(_this)) $(_this).addClass('disabled');
    $.ajax({
      url: WebsitePath + "/manage",
      data: data,
      cache: false,
      dataType: "json",
      type: "POST",
      success: function (Data) {
        if (isDomElement(_this)) $(_this).removeClass('disabled');
        if (Data.Status == 1) {
          success(Data);
        } else {
          FimTale.global.msg(Data.ErrorMessage);
          if (failure) failure(Data.ErrorMessage);
        }
      },
      error: function (err) {
        if (isDomElement(_this)) $(_this).removeClass('disabled');
        FimTale.global.confirm(translate('Action_Failed', {"Action": translate('Operation')}), translate('Action_Failed', {"Action": translate('Operation')}) + ', ' + translate('Feedback_Confirm'), function () {
          FimTale.report.addReasonWithTarget('system', 0, err.responseText);
        });
        console.log(err.responseText);
        if (failure) failure(err.responseText);
      }
    });
  },
  //获得字符串
  getJson: function (action, data, success, error) {
    if (data == null) data = {};
    data['FormHash'] = FormHash;
    $.ajax({
      url: WebsitePath + "/json/" + action,
      data: data,
      cache: false,
      dataType: "json",
      type: "GET",
      success: function (Json) {
        success(Json);
      },
      error: function (Json) {
        console.log(Json.responseText);
        if (error != null) error(Json);
      }
    });
  }
};

var NavHandler = function () {
  var _this = this;
  this.navbar = $('#navbar');
  this.lastScroll = $(window).scrollTop();
  this.navbarTop = parseFloat(this.navbar.css('top'));
  this.height = this.navbar.height();
  this.totalHeight = 0;
  $('nav').each(function () {
    _this.totalHeight += $(this).height();
  });
  this.supportBlur = false;//navigator.userAgent.indexOf('MSIE') >= 0 && navigator.userAgent.indexOf('Opera') < 0 && CSS && CSS.supports && (CSS.supports("backdrop-filter", "blur(10px)") || CSS.supports("-webkit-backdrop-filter", "blur(10px)"));
  this.backgroundColor = [238, 110, 115];
  this.refreshNavBgColor = function () {
    this.navbar.css('background-color', '');
    this.navbar.css('background-color').replace(/rgba?\(([0-9 ]+),([0-9 ]+),([0-9 ]+)/, function (a, b, c, d) {
      _this.backgroundColor = [parseInt(b), parseInt(c), parseInt(d)];
    });
    this.navbar.parent().css('background-color', 'rgb(' + this.backgroundColor[0] + ',' + this.backgroundColor[1] + ',' + this.backgroundColor[2] + ')');
    this.roll();
  };

  this.bind = function () {
    var _this = this;
    $(window).scroll(function () {
      _this.roll();
    }).resize(function () {
      _this.roll();
    });
    _this.navbar.css('transition', 'box-shadow .3s').css('z-index', '999');
  };

  this.roll = function () {
    var currentScroll = $(window).scrollTop(),
      css = {'position': 'relative', 'top': ''};
    this.navbarTop = Math.max(Math.clamp(this.navbarTop - (currentScroll - this.lastScroll), -this.height, 0), -this.lastScroll);
    if ($(window).width() >= 993) this.navbarTop = 0;
    if (currentScroll > 0) css = {
      'position': 'fixed',
      'top': this.navbarTop + 'px'
    };
    if (currentScroll + this.height + this.navbarTop > this.totalHeight && this.navbarTop > -this.height) {
      if (this.supportBlur) this.navbar.css('background-color', 'rgba(' + this.backgroundColor[0] + ',' + this.backgroundColor[1] + ',' + this.backgroundColor[2] + ',0.8)');
      if (this.navbar.hasClass('z-depth-0')) this.navbar.removeClass('z-depth-0');
    } else {
      if (this.supportBlur) this.navbar.css('background-color', 'rgb(' + this.backgroundColor[0] + ',' + this.backgroundColor[1] + ',' + this.backgroundColor[2] + ')');
      if (!this.navbar.hasClass('z-depth-0')) this.navbar.addClass('z-depth-0');
    }
    this.navbar.css(css);
    this.lastScroll = currentScroll;
  };

  this.bind();
  //this.refreshNavBgColor();
};

var SearchHandler = function () {
  this.href = window.location.href.split('?')[0];
  this.args = null;
  this.catIndicator = $('.catIndicator');
  this.searchText = $('.searchText');
  this.sortBySelector = $('.sortbySelector');
  this.searchBtn = $('.searchBtn');

  this.init = function () {
    $(function () {
      $('select').formSelect();
    });
    this.args = FimTale.global.getQueryStringArgs();
    if (this.args.page) delete this.args.page;
    this.args.q = this.args['q'] || null;
    if (this.args.q) this.args.q = this.args.q.replace(/\+/g, ' ');
    this.args.sortby = this.args['sortby'] || null;
    this.args.cat = this.args['cat'] || null;
    this.refresh();
  };

  this.bind = function () {
    var obj = this;
    this.searchText.on('blur', function () {
      obj.refresh();
    }).on("input propertychange", function () {
      obj.args.q = $(this).val() || null;
    }).keypress(function (event) {
      if (event.charCode === 13) {
        if ($(this).attr('data-href-selector') != null) {
          obj.search($($(this).attr('data-href-selector')));
        } else {
          obj.search();
        }
      }
    });
    this.sortBySelector.bind('change', function () {
      obj.args.sortby = $(this).val();
      obj.refresh();
    });
    this.searchBtn.click(function () {
      obj.search($(this));
    });
  };

  this.refresh = function () {
    if (this.args.q != null) {
      this.searchText.val(this.args.q);
    } else {
      this.searchText.val('');
    }
    if (this.args.sortby != null) this.sortBySelector.val(this.args.sortby);
  };

  this.insert = function (word) {
    this.args.q = (this.args.q == null ? '' : (this.args.q + ' ')) + word;
    this.refresh();
  };

  this.search = function (hrefSelector) {
    var ready = true,
      tempHref = this.href,
      pjaxTarget = null;
    if (hrefSelector) {
      if (hrefSelector.attr('data-href')) tempHref = hrefSelector.attr('data-href');
      if (hrefSelector.attr('data-pjax-target')) pjaxTarget = hrefSelector.attr('data-pjax-target');
    }
    if (this.args.q != null && this.args.q.charAt(0) == '@') {
      tempHref = '/u/' + encodeURIComponent(this.args.q.replace("@", ""));
    } else if (this.args.q != null && this.args.q.indexOf('ticket:') == 0) {
      tempHref = '/channel/ballot-result/' + encodeURIComponent(this.args.q.replace(/^ticket\:/g, ''));
    } else if (tempHref == '/u/') {
      tempHref = tempHref + this.args.q;
    } else {
      var queryArr = [];
      for (var key in this.args) {
        if (this.args[key] != null) queryArr.push(key + '=' + encodeURIComponent(this.args[key]));
      }
      if (queryArr.length == 0) ready = false;
      if (ready) tempHref = tempHref + '?' + queryArr.join('&');
    }
    if (ready) {
      if (pjaxTarget) {
        $.pjax({
          url: tempHref,
          fragment: pjaxTarget,
          container: pjaxTarget,
          timeout: 1500
        });
      } else {
        window.location.href = tempHref;
      }
    }
  };

  this.init();
  this.bind();
};

var BackgroundSetter = function () {
  this.isInit = true;
  this.target = $('body, .option-bar');
  this.curReadingColor = '';

  this.isDarkMode = function () {
    return !!document.getElementById("darkmode");
  };

  this.init = function () {
    if (localStorage.getItem('reading-color')) this.curReadingColor = localStorage.getItem('reading-color');
    this.setBackgroundColor();
    this.setTrigger();
    this.isInit = false;
  };

  this.setTrigger = function () {
    var obj = this;

    $('.change-background-color-btn').click(function () {
      obj.curReadingColor = $(this).data('color');
      obj.setBackgroundColor();
      localStorage.setItem('reading-color', obj.curReadingColor);
    });

    $('.reading-font-mode-switch').parent().find('.value').on('DOMNodeInserted', function () {
      var fontModes = ['源', '文', '简'];
      var mode = parseInt($(this).html());
      $(this).html(fontModes[mode]);
    });
  };

  this.setBackgroundColor = function () {
    this.target.css('background-color', this.isDarkMode() ? '' : this.curReadingColor);
    this.darkClear();
  };

  this.darkClear = function () {
    var obj = this;
    $('.passage *:not(.card):not(.btn):not(.spoiler),.comment *:not(.card):not(.btn):not(.spoiler)').each(function () {
      var cSelector = $(this);
      var tempBGC, tempFTC;
      obj.reverseFont(cSelector);
      if (obj.isDarkMode()) {
        cSelector.attr('data-backgroundColor', cSelector.css('background-color'));
        cSelector.css("background-color", "rgba(0, 0, 0, 0)");
      } else {
        if (!obj.isInit) {
          tempBGC = cSelector.attr('data-backgroundColor') || '';
          tempFTC = cSelector.attr('data-textColor') || '';
          cSelector.css({"background-color": tempBGC, "color": tempFTC});
        }
      }
    });
  };

  this.reverseFont = function (cSelector) {
    var obj = this;
    var tempRGB = FimTale.global.transformRGBStringToArray(cSelector.css('color'));
    if (tempRGB[0] < 203 && tempRGB[1] < 203 && tempRGB[2] < 203) {
      cSelector.attr('data-textColor', cSelector.css('color'));
      if (obj.isDarkMode()) {
        var dec = Math.min(203 - tempRGB[0], 203 - tempRGB[1], 203 - tempRGB[2]);
        tempRGB = [tempRGB[0] + dec, tempRGB[1] + dec, tempRGB[2] + dec];
        cSelector.css("color", "rgb(" + tempRGB[0] + ", " + tempRGB[1] + ", " + tempRGB[2] + ")");
      }
    } else {
      if (!FimTale.global.isArrayEqual(tempRGB, FimTale.global.transformRGBStringToArray($('#text-color-picker').css('color'))) && !FimTale.global.isArrayEqual(tempRGB, FimTale.global.transformRGBStringToArray($('#link-color-picker').css('color'))) && obj.isInit) {
        cSelector.attr('data-textColor', cSelector.css('color'));
      }
    }
  };

  this.init();
};

var FontSetter = function (conf) {
  conf = conf || {};
  $.extend({}, conf);
  this.passageSelector = $('.passage');
  this.passage = '';
  this.commentSelector = $('.comment');
  this.fontRangeBar = $('.font-range-bar');
  this.changeFontBtn = $('.change-font-btn');
  this.readingFontModeSwitch = $(".reading-font-mode-switch");
  this.curFontSize = this.initFontSize = 2 * Math.ceil(parseInt($('#text-color-picker').css('font-size')) / 2);
  this.curFontFamily = 'Noto Serif SC';
  this.curFontMode = 0;

  this.init = function () {
    this.curFontSize = localStorage.getItem('reading-font-size') || this.curFontSize;
    this.curFontSize = parseInt(this.curFontSize);
    this.curFontFamily = localStorage.getItem('reading-font') || this.curFontFamily;
    this.curFontMode = localStorage.getItem('reading-font-mode') || this.curFontMode;
    switch (this.curFontMode) {
      case 'true':
        this.curFontMode = 1;
        break;
      case 'false':
        this.curFontMode = 0;
        break;
    }
    var obj = this;
    this.curFontMode = parseInt(this.curFontMode);
    if (this.passageSelector.length) {
      $('head').append('<link href="https://fonts.googleapis.com/css?family=Noto+Serif+SC" rel="stylesheet"/>');
      this.passageSelector.find('*').each(function () {
        $(this).attr('data-font-size', $(this).css('font-size'));
      });
      this.passage = this.passageSelector.html();
    }
    this.apply();
    this.setTrigger();
    FimTale.global.loadScript('/static/js/fontdetector.js', function () {
      var fonts = fontDetector.detect(),
        selections = '<option value="Noto Serif SC">' + translate('Default') + '</option>';
      if (conf['ServerFonts']) {
        for (var k in conf['ServerFonts']) {
          selections = selections + '<option value="' + conf['ServerFonts'][k][1] + '">' + conf['ServerFonts'][k][0] + '</option>';
        }
      }
      for (var i in fonts) {
        selections = selections + '<option value="' + fonts[i][1] + '">' + fonts[i][0] + '</option>';
      }
      $('.user-fonts').html(selections).each(function () {
        if ($(this).find('option[value="' + obj.curFontFamily + '"]').length > 0) $(this).val(obj.curFontFamily);
      }).change(function () {
        obj.curFontFamily = $(this).val();
        obj.applyFontFamily();
        localStorage.setItem('reading-font', obj.curFontFamily);
        $('.user-fonts').each(function () {
          $(this).val(obj.curFontFamily);
          $(this).parent().children('input[type="text"]').val($(this).find('option[value="' + obj.curFontFamily + '"]').html());
        });
      });
      $(function () {
        $('.user-fonts').formSelect();
      });
    });
  };

  this.setTrigger = function () {
    var obj = this;
    this.fontRangeBar.on('input propertychange', function () {
      obj.curFontSize = $(this).val();
      obj.applyFontSize();
      localStorage.setItem('reading-font-size', obj.curFontSize);
    });

    this.changeFontBtn.click(function () {
      obj.curFontFamily = $(this).data('font');
      obj.applyFontFamily();
      localStorage.setItem('reading-font', obj.curFontFamily);
    });

    this.readingFontModeSwitch.change(function () {
      obj.applyFontMode($(this).val());
    });

    $(".reading-font-mode-tags").click(function () {
      obj.applyFontMode($(this).data('font-mode'));
    });
  };

  this.apply = function () {
    this.applyFontSize();
    this.applyFontFamily();
  };

  this.addContainerForTable = function (selector) {
    selector.children('table').each(function () {
      this.outerHTML = '<div class="table-container">' + this.outerHTML + '</div>';
    });
    selector.find('table').each(function () {
      var parent = $(this).parent();
      if (!parent.hasClass('table-container')) parent.addClass('table-container');
    });
  };

  this.applyFontSize = function () {
    var curFontSize = parseInt(this.curFontSize),
      curFontMode = parseInt(this.curFontMode);
    this.applyPassageFontSize();
    //this.applyCommentFontSize();
    this.fontRangeBar.each(function () {
      $(this).val(curFontSize);
    });
    this.readingFontModeSwitch.each(function () {
      $(this).val(curFontMode);
    });
  };

  this.applyPassageFontSize = function (selector) {
    selector = selector || this.passageSelector;
    var initFontSize = parseInt(this.initFontSize),
      curFontSize = parseInt(this.curFontSize),
      curFontMode = parseInt(this.curFontMode);
    if (curFontMode === 2) this.polish();
    this.addContainerForTable(selector);
    selector.find('*').each(function () {
      if (!$(this).attr('data-font-size')) $(this).attr('data-font-size', $(this).css('font-size') || $(this).parent().css('font-size'));
    });
    selector.children().each(function () {
      var originalSize = parseInt($(this).attr('data-font-size')) || parseInt($(this).css('font-size'));
      originalSize = 2 * Math.ceil(originalSize / 2);
      $(this).find('*').each(function () {
        var thisSize = parseInt($(this).attr('data-font-size')) || parseInt($(this).css('font-size')) || parseInt($(this).parent().css('font-size'));
        thisSize = 2 * Math.ceil(thisSize / 2);
        var sizeDivision = thisSize - originalSize;
        var applySize = (curFontMode === 0) ? curFontSize + sizeDivision : curFontSize;
        $(this).css('font-size', applySize + 'px');
      });
      if (curFontMode > 0) {
        $(this).css('font-size', curFontSize + 'px');
      } else {
        $(this).css('font-size', (originalSize + curFontSize - initFontSize) + 'px');
      }
    });
    for (var i = 1; i < 7; i++) {
      selector.find('h' + i).each(function () {
        var targetSize = curFontSize * (2 - (i - 1) / 6);
        $(this).css('font-size', targetSize + 'px').find('*').css('font-size', targetSize + 'px');
      });
    }
    selector.find('sub,sup').each(function () {
      var targetSize = parseInt($(this).css('font-size')) * 0.4;
      $(this).css('font-size', targetSize + 'px').find('*').css('font-size', targetSize + 'px');
    });
    selector.find('.share-item').each(function () {
      $(this).css('font-size', '16px').find('*').each(function () {
        $(this).css('font-size', $(this).attr('data-font-size'));
      })
    });
  };

  this.applyCommentFontSize = function (selector) {
    selector = selector || this.commentSelector;
    this.addContainerForTable(selector);
    selector.each(function () {
      $(this).find(':not(.material-icons)').each(function () {
        if (!$(this).attr('data-font-size')) $(this).attr('data-font-size', $(this).css('font-size') || $(this).parent().css('font-size'));
      });
      $(this).find(':not(.material-icons)').css('font-size', '16px');
      for (var i = 1; i < 7; i++) {
        $(this).find('h' + i).each(function () {
          var targetSize = parseInt($(this).css('font-size')) + 14 - 2 * i;
          $(this).css('font-size', targetSize + 'px');
        });
      }
      $(this).find('sub,sup').each(function () {
        var targetSize = parseInt($(this).css('font-size')) * 0.4;
        $(this).css('font-size', targetSize + 'px');
      });
    });
    selector.find('.share-item').each(function () {
      $(this).css('font-size', '16px').find('*').each(function () {
        $(this).css('font-size', $(this).attr('data-font-size'));
      })
    });
  };

  this.applyFontFamily = function () {
    var family = this.curFontFamily + ', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif';
    this.passageSelector.css('font-family', family).find('*:not(.material-icons)').css('font-family', family);
  };

  this.applyFontMode = function (val) {
    this.curFontMode = parseInt(val);
    this.passageSelector.html(this.passage);
    this.apply();
    localStorage.setItem('reading-font-mode', this.curFontMode);
  };

  this.polish = function () {
    this.passageSelector.find('*').each(function () {
      var color = FimTale.global.transformRGBStringToArray($(this).css('color')),
        rawDecoration = $(this).css('text-decoration'),
        decoration = null;
      var textColor = FimTale.global.transformRGBStringToArray($('#text-color-picker').css('color')),
        linkColor = FimTale.global.transformRGBStringToArray($('#link-color-picker').css('color'));
      if (FimTale.global.isArrayEqual(color, textColor) || FimTale.global.isArrayEqual(color, linkColor)) color = null;
      rawDecoration.replace(/(underline|line-through)+/, function (a, b) {
        decoration = b;
      });
      var display = $(this).css('display');
      $(this).removeAttr("style");
      $(this).html($(this).html().replace(/　/g, '&nbsp;').replace(/<br>(&(nb|en|em|thin)sp;)*/g, '<br>').replace(/&(nb|en|em|thin)sp;/g, ' ').trim());
      if (color != null) $(this).css('color', 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')');
      if (decoration != null) $(this).css('text-decoration', decoration);
      if (display) $(this).css('display', display);
    });
    this.passageSelector.children().css({'margin': '12px 0'});
  };

  this.init();
};

var ImageSetter = function (isPictureMode) {
  var _this = this;
  this.imageSelector = $('.passage img');
  this.isPictureMode = !!isPictureMode;
  this.init = function () {
    if (_this.isPictureMode) {
      _this.imageSelector.each(function () {
        var oriWidth = $(this).get(0).naturalWidth;
        if (oriWidth > 150) $(this).attr('style', 'width:100%;height:auto;margin:5px 0;');
      });
    }
    _this.imageFit($('.passage'));
  };
  this.imageFit = function (container) {
    container.find(":not(img)").each(function () {
      $(this).html(emojione.toImage(FTEmoji.toFTEmoji($(this).html()))).css('width', '').css('height', '');
    });

    container.find('img:not(.emojione):not(.ftemoji):not(.rendered)').each(function () {
      var _this = this;
      $(_this).removeAttr('style').removeAttr('width').removeAttr('height').addClass('materialboxed').addClass('rendered');
      switch ($(_this).parent().css('text-align')) {
        case 'center':
          $(_this).css({"margin-left": "auto", "margin-right": "auto"});
          break;
        case 'right':
          $(_this).css({"margin-left": "auto"});
          break;
        default:
          $(_this).css({"margin-right": "auto"});
          break;
      }
      $(function () {
        $(_this).materialbox();
      });
    });
  };
  this.init();
};
var ShareHandler = function (config) {
  this._config = {
    url: encodeURIComponent(config.url || document.location),
    title: encodeURIComponent(config.title || document.title),
    source: encodeURIComponent(config.source || ''),
    sourceUrl: encodeURIComponent(config.sourceUrl || ''),
    description: encodeURIComponent(config.description || ''),
    showcount: parseInt(config.showcount || 0),
    summary: encodeURIComponent(config.summary || ''),
    site: encodeURIComponent(config.site || ''),
    pics: encodeURIComponent(config.pics || ''),
    encode: config.encode || 'utf-8'
  };
  this.getShareURL = function (domain) {
    switch (domain) {
      case 'qq':
        return 'https://connect.qq.com/widget/shareqq/index.html?site=' + this._config.site + '&title=' + this._config.title + '&summary=' + this._config.summary + '&pics=' + this._config.pics + '&url=' + this._config.url
        break;
      case 'qzone':
        return 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + this._config.url.replace(/http[s]?%3A%2F%2F/, '') + '&showcount=' + this._config.showcount + '&summary=' + this._config.summary + '&title=' + this._config.title + '&site=' + this._config.site + '&pics=' + this._config.pics;
        break;
      case 'weibo':
        return 'http://service.weibo.com/share/share.php?title=' + this._config.title + '&url=' + this._config.url + '&source=' + this._config.source + '&sourceUrl=' + this._config.sourceUrl + '&content=' + this._config.encode + '&pic=' + this._config.pics;
        break;
      case 'tieba':
        return 'http://tieba.baidu.com/f/commit/share/openShareApi?title=' + this._config.title + '&url=' + this._config.url + '&pic=' + this._config.pics;
        break;
      case 'douban':
        return 'http://shuo.douban.com/!service/share?href=' + this._config.url + '&name=' + this._config.title + '&image=' + this._config.pics;
        break;
      case 'renren':
        return 'http://widget.renren.com/dialog/share?link=' + this._config.url + '&title=' + this._config.title;
        break;
      case 'kaixin':
        return 'http://www.kaixin001.com/rest/records.php?url=' + this._config.url + '&content=' + this._config.description + '&pic=' + this._config.pics + '&showcount=0&style=11&aid=' + this._config.site;
        break;
    }
  };
  this.share = function (domain) {
    window.open(this.getShareURL(domain), 'blank');
  };
  this.openContacts = function (onClickTemplate) {
    var renderer = function (res, container) {
      var textRes = '';
      for (var k in res) {
        textRes = textRes + '<tr><td onclick="' + onClickTemplate(res[k]['UserName']) + '" style="cursor: pointer;"><img src="' + res[k]['Avatar'] + '" class="inline-avatar circle" loading="lazy"> ' + res[k]['UserName'] + '</td></tr>';
      }
      container.html(textRes);
    };
    if (!$('#contacts-container').length) {
      $('body').append('<div id="contacts-container" class="modal modal-fixed-footer"><a href="#!" class="modal-close waves-effect waves-red btn-flat" style="position:absolute;top:0%;right:0%;font-size:30px;">×</a><div class="modal-content"><div class="row"><ul id="contacts-tabs" class="tabs tabs-fixed-width col s12"><li class="tab"><a href="#inbox-list">' + translate('Contacts') + '</a></li><li class="tab"><a href="#friend-list">' + translate('Friends') + '</a></li><li class="tab"><a href="#search-contact">' + translate('Search') + '</a></li></ul><div id="inbox-list" class="col s12 no-padding"><table></table></div><div id="friend-list" class="col s12 no-padding"><table></table></div><div id="search-contact" class="col s12 no-padding"><div class="input-field"><i class="material-icons prefix">&#xe8b6;</i><input id="contacts-search-input" type="text" placeholder="' + translate('Search_By_UserName') + '"></div><table id="contacts-search-result"></table></div></div></div></div>');
      $('#contacts-container').modal();
      FimTale.editor.tools.bindNameSearch($('#contacts-search-input'), function (res) {
        renderer(res, $('#contacts-search-result'));
      }, function () {
      });
    }
    FimTale.getJson('getContact', null, function (res) {
      renderer(res.InboxArr, $('#inbox-list table'));
      renderer(res.FriendArr, $('#friend-list table'));
    }, function (err) {
      console.log(err);
    });
    $('#contacts-container').modal('open');
    $('#contacts-tabs').tabs();
  };
};

var FTEmoji = {
  path: '/static/img/ftemoji/',
  //缩写名称库
  basicEmojis: null,
  localEmojis: {
    ponies: ["lunateehee", "raritydaww", "ajsup", "ohcomeon", "raritynews", "lunawait", "twicrazy", "rarishock", "flutterfear", "abwut", "flutteryay", "rarityyell", "noooo", "spikepushy", "soawesome", "facehoof", "pinkamina", "joy", "lunagasp", "trixiesad", "rdscared", "lyra", "wahaha", "pinkiesad", "starlightrage", "flutterhay", "sgpopcorn", "celestiahurt", "sgsneaky", "celestiahappy", "lunagrump", "twieek", "appleroll", "tempestgaze", "twisheepish", "pinkiesugar", "sunsetgrump", "sunspicious", "silverstream", "cozyglow"]
  },
  //初始化
  init: function (textForSearch) {
    var text = "",
      len = 0,
      amount = 0,
      i, emoji;
    textForSearch = textForSearch || '';
    for (emoji in FTEmoji.localEmojis) {
      len = FTEmoji.localEmojis[emoji].length;
      amount = 0;
      $('#emoji_' + emoji).html('');
      for (i = 0; i < len; i++) {
        if (textForSearch == "" || FTEmoji.localEmojis[emoji][i].search(textForSearch) != -1) {
          text = '<div class="col s2 m1 center" style="padding: 0 2%;"><a style="cursor:pointer;" class="ftemoji-picker" onclick="FTEmoji.chooseEmoji(\':ftemoji_' + FTEmoji.localEmojis[emoji][i] + ':\');"><img style="width:100%;height:100%;margin:5px 0;" src="' + FTEmoji.path + FTEmoji.localEmojis[emoji][i] + '.png" title=":ftemoji_' + FTEmoji.localEmojis[emoji][i] + ':" loading="lazy"></a></div>';
          $('#emoji_' + emoji).append(text);
          amount++;
        }
      }
      $('#emoji_' + emoji + ',#emoji_title_' + emoji).css('display', (amount === 0 || len === 0) ? 'none' : 'block');
    }
    for (emoji in FTEmoji.basicEmojis) {
      len = FTEmoji.basicEmojis[emoji].length;
      amount = 0;
      $('#emoji_' + emoji).html('');
      for (i = 0; i < len; i++) {
        if (textForSearch == "" || FTEmoji.basicEmojis[emoji][i][0].search(textForSearch) != -1) {
          text = '<div class="col s2 m1 center"><a class="ftemoji-picker" style="cursor:pointer;" onclick="FTEmoji.chooseEmoji(\':' + FTEmoji.basicEmojis[emoji][i][0] + ':\');"><div style="font-size:20px;min-height: 30px;" title=":' + FTEmoji.basicEmojis[emoji][i][0] + ':">' + FTEmoji.basicEmojis[emoji][i][1] + '</div></a></div>';
          $('#emoji_' + emoji).append(text);
          amount++;
        }
      }
      $('#emoji_' + emoji + ',#emoji_title_' + emoji).css('display', (amount === 0 || len === 0) ? 'none' : 'block');
    }
  },
  //打开面板
  openPanel: function () {
    $(function () {
      if (!$('#emoji-panel').length) {
        $('body').append('<div id=\"emoji-panel\" class=\"modal layer-color\"><div class=\"modal-content\"><a href=\"#!\" class=\"modal-close waves-effect waves-red btn-flat\" style=\"position:absolute;top:0%;right:0%;font-size:30px;\">×<\/a><div class=\"page-subtitle by-theme-text\">' + translate('Select_Emoji') + '<\/div><div style=\"line-height: 150%;\">' + translate('Search') + '<\/div><div class=\"row\"><div class=\"col s10\"><input id=\"emoji_search\" type=\"text\" onkeypress=\"ftEmoji.searchBarChange(event);\"><\/div><div class=\"col s2\"><a class=\"searchBtn btn-flat waves-effect\" onclick=\"ftEmoji.searchStart();\"><i class=\"material-icons\">&#xe8b6;<\/i><\/a><\/div><\/div><div id=\"emoji_title_activeEmoji\" style=\"line-height: 150%;display: none;\">' + translate('Dynamic_Emoji') + '<\/div><div id=\"emoji_activeEmoji\" class=\"row\" style=\"display: none;\"><\/div><div id=\"emoji_title_ponies\" style=\"line-height: 150%;\">' + translate('Ponies') + '<\/div><div id=\"emoji_ponies\" class=\"row\"><\/div><div id=\"emoji_title_smileys_people\" style=\"margin:10px 0;\">' + translate('Faces_Actions') + '<\/div><div id=\"emoji_smileys_people\" class=\"row\"><\/div><div id=\"emoji_title_animals_nature\" style=\"margin:10px 0;\">' + translate('Animals_Nature') + '<\/div><div id=\"emoji_animals_nature\" class=\"row\"><\/div><div id=\"emoji_title_food_drink\" style=\"margin:10px 0;\">' + translate('Food_Drink') + '<\/div><div id=\"emoji_food_drink\" class=\"row\"><\/div><div id=\"emoji_title_activity\" style=\"margin:10px 0;\">' + translate('Activities') + '<\/div><div id=\"emoji_activity\" class=\"row\"><\/div><div id=\"emoji_title_travel_places\" style=\"margin:10px 0;\">' + translate('Journey') + '<\/div><div id=\"emoji_travel_places\" class=\"row\"><\/div><div id=\"emoji_title_objects\" style=\"margin:10px 0;\">' + translate('Items') + '<\/div><div id=\"emoji_objects\" class=\"row\"><\/div><div id=\"emoji_title_symbols\" style=\"margin:10px 0;\">' + translate('Symbols') + '<\/div><div id=\"emoji_symbols\" class=\"row\"><\/div><div id=\"emoji_title_flags\" style=\"margin:10px 0;\">' + translate('Flags') + '<\/div><div id=\"emoji_flags\" class=\"row\"><\/div><\/div><\/div>');
        $('#emoji-panel').modal();
      }
      if (FTEmoji.basicEmojis != null) {
        FTEmoji.init();
        $('#emoji-panel').modal('open');
      } else {
        $.getJSON(WebsitePath + '/static/files/emoji_map.json', function (temp) {
          FTEmoji.basicEmojis = temp;
          FTEmoji.init();
          $('#emoji-panel').modal('open');
        });
      }
    });
  },
  //选择添加
  chooseEmoji: function (shortname) {
    if (!tinymce.activeEditor) return;
    if (FimTale.browser.versions.ios != true) {
      tinymce.activeEditor.insertContent(shortname);
    } else {
      tinymce.activeEditor.setContent((function (a, b) {
        var temp = $('<div></div>');
        temp.html(a);
        var m = temp.children().last();
        if (m.length > 0) {
          m.append(b);
          return temp.html();
        } else {
          return '<p>' + b + '</p>';
        }
      })(tinymce.activeEditor.getContent(), shortname));
    }
    $('#emoji-panel').modal('close');
  },
  //检测键盘
  searchBarChange: function (e) {
    var e = e || window.event;
    if (e.keyCode == 13) {
      FTEmoji.searchStart();
    }
  },
  //搜索开始
  searchStart: function () {
    var textForSearch = $('#emoji_search').val();
    FTEmoji.init(textForSearch);
  },
  //匹配ftemoji并转化
  toFTEmoji: function (html) {
    html = html.replace(/:ftemoji_([A-Za-z0-9\_]+):/g, '<img class="ftemoji" src="' + FTEmoji.path + '$1.png" alt="$1" title=":$1:" loading="lazy">');
    return html;
  }
};

var ResponsiveTab = function (trigger, config) {
  var _this = this;
  this.trigger = trigger;
  this.triggerStatus = 0;
  this.config = {
    tabIndex: _this.trigger.attr('id')
  };
  if (config == null) {
    config = {};
  }
  $.extend(this.config, config);
  this.set = function (trigger) {
    var wWidth = $(window).width();
    if (wWidth >= 993) {
      if (_this.triggerStatus === 1) {
        M.Tabs.getInstance(trigger).destroy();
        _this.triggerStatus = 0;
      }
    } else {
      if (_this.triggerStatus === 0) {
        trigger.tabs({
          onShow: function (r) {
            var index = $(r).attr('id');
            localStorage.setItem('last-' + _this.config.tabIndex + '-index', index);
          }
        });
        _this.triggerStatus = 1;
        _this.recover();
      }
    }
  };
  this.bind = function (trigger) {
    trigger.each(function () {
      _this.set(trigger);
      $(window).resize(function () {
        _this.set(trigger);
      });
    });
  };
  this.recover = function () {
    if (_this.triggerStatus !== 1) return;
    var defaultIndex = (function () {
        var res = "";
        trigger.find("a").each(function () {
          var temp = $(this).attr("href");
          if (temp.indexOf('#')) {
            res = temp.replace(/^#/, '');
            return false;
          }
        });
        return res;
      })(),
      index = localStorage.getItem('last-' + _this.config.tabIndex + '-index') || defaultIndex;
    M.Tabs.getInstance(_this.trigger).select(index);
  };
  this.bind(trigger);
};

var ActionBar = function (selector, config) {
  var _this = this;
  this.selector = selector;
  this.lastScroll = $(window).scrollTop();
  this.config = {
    defaultTab: null,
    hideOnScroll: false,
    onLoadEnd: null,
    onSwitchStart: null,
    onSwitchEnd: null
  };
  if (config == null) {
    config = {};
  }
  $.extend(this.config, config);
  this._init = function () {
    this._bind();
    var activeChild = null;
    _this.selector.children('.action-bar-tab').each(function () {
      if (activeChild == null || $(this).hasClass('active') || ($(this).attr('data-target') != null && $(this).attr('data-target') == _this.config.defaultTab)) activeChild = $(this);
    });
    if (activeChild != null && activeChild.attr('data-target') != null) _this.switch(activeChild.attr('data-target'));
    if (typeof _this.config.onLoadEnd == 'function') this.config.onLoadEnd(_this, selector);
  };
  this._bind = function () {
    _this.selector.children('.action-bar-tab').click(function () {
      var target = $(this).attr('data-target');
      if (target != null) _this.switch(target);
    });
    _this.selector.css({'position': 'fixed', 'bottom': 0});
    var locate = function () {
      var curScroll = $(window).scrollTop(),
        hideOnScroll = (typeof _this.config.hideOnScroll == "function" ? _this.config.hideOnScroll() : _this.config.hideOnScroll),
        nextTop = hideOnScroll ? Math.max(0 - _this.selector.outerHeight(true), Math.min(0, parseInt(_this.selector.css('bottom')) - curScroll + _this.lastScroll)) : 0;
      _this.selector.css('bottom', nextTop + 'px');
      _this.lastScroll = curScroll;
    };
    $(window).scroll(locate);
  };
  this.switch = function (activeTarget) {
    if (typeof _this.config.onSwitchStart == 'function') _this.config.onSwitchStart(_this.selector.children('.action-bar-tab.active').attr('data-target'));
    _this.selector.children('.action-bar-tab').each(function () {
      var target = $(this).attr('data-target');
      $(this).removeClass('active');
      $('#' + target).hide();
      if (target == activeTarget) {
        $(this).addClass('active');
        $('#' + target).show();
      }
    });
    if (typeof _this.config.onSwitchEnd == 'function') _this.config.onSwitchEnd(activeTarget);
  };
  this._init();
};

var PushPin = function (selector, config) {
  var _this = this;
  this.selector = selector;
  this.config = {
    top: 0,
    bottom: 0,
    offset: 0
  };
  if (config == null) {
    config = {};
  }
  $.extend(this.config, config);
  this.locate = function () {
    var curr = $(window).scrollTop(), elTop = 0, getVal = function (c) {
        if (typeof c == 'function') {
          return c();
        } else {
          return c;
        }
      }, _top = getVal(_this.config.top), _bottom = getVal(_this.config.bottom),
      _offset = getVal(_this.config.offset);
    if (curr < _top) {
      elTop = _top - curr + _offset;
    } else if (curr < _bottom) {
      elTop = _offset;
    } else {
      elTop = _bottom - curr + _offset;
    }
    _this.selector.css('top', elTop + 'px');
  };
  this._bind = function () {
    _this.selector.css('position', 'fixed');
    _this.locate();
    $(window).scroll(function () {
      _this.locate();
    }).resize(function () {
      _this.locate();
    });
  };
  this._bind();
};

var ResponsiveMenu = function (trigger) {
  var _this = this;
  this.self = null;
  this.mode = '';
  this.initResponsiveMenu = function (trigger) {
    if (!trigger || !trigger.length) return;
    trigger.each(function () {
      var target = $('#' + $(this).data('target'));
      if (!target || !target.length) return;
      var items = target.children();
      if (!items.length) {
        $(this).hide();
      } else {
        $(this).show();
      }
      if (($(window).width() < 993) || FimTale.browser.versions.ios) {
        if (_this.mode != 'modal') {
          if (_this.self) _this.self.destroy();
          items.addClass('modal-close');
          target.addClass('modal').addClass('bottom-sheet').modal();
          _this.self = M.Modal.getInstance(target);
          _this.mode = 'modal';
        }
      } else {
        if (_this.mode != 'dropdown') {
          if (_this.self) _this.self.destroy();
          target.removeClass('modal').removeClass('bottom-sheet');
          items.removeClass('modal-close');
          $(this).dropdown({
            alignment: 'right'
          });
          _this.self = M.Dropdown.getInstance($(this));
          _this.mode = 'dropdown';
        }
      }
    });
  };
  this.bind = function (trigger) {
    if (!trigger || !trigger.length) return;
    trigger.addClass('dropdown-trigger').addClass('modal-trigger');
    _this.initResponsiveMenu(trigger);
    $(window).resize(function () {
      _this.initResponsiveMenu(trigger);
    });
  };
  this.bind(trigger);
};

//函数insertContent
(function ($) {
  $.fn.extend({
    insertContent: function (myValue, t) {
      var $t = $(this)[0];
      if (document.selection) {
        this.focus();
        var sel = document.selection.createRange();
        sel.text = myValue;
        this.focus();
        sel.moveStart('character', -l);
        var wee = sel.text.length;
        if (arguments.length == 2) {
          var l = $t.value.length;
          sel.moveEnd("character", wee + t);
          t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel.moveStart("character", wee - t - myValue.length);
          sel.select();
        }
      } else if ($t.selectionStart || $t.selectionStart == '0') {
        var startPos = $t.selectionStart;
        var endPos = $t.selectionEnd;
        var scrollTop = $t.scrollTop;
        $t.value = $t.value.substring(0, startPos) +
          myValue +
          $t.value.substring(endPos, $t.value.length);
        this.focus();
        $t.selectionStart = startPos + myValue.length;
        $t.selectionEnd = startPos + myValue.length;
        $t.scrollTop = scrollTop;
        if (arguments.length == 2) {
          $t.setSelectionRange(startPos - t,
            $t.selectionEnd + t);
          this.focus();
        }
      } else {
        this.value += myValue;
        this.focus();
      }
    },
    disableSelection: function () {
      return this.attr('unselectable', 'on')
        .css({
          '-moz-user-select': '-moz-none',
          '-moz-user-select': 'none',
          '-o-user-select': 'none',
          '-khtml-user-select': 'none',
          '-webkit-user-select': 'none',
          '-ms-user-select': 'none',
          'user-select': 'none'
        })
        .bind('selectstart', false);
    }
  });
})(jQuery);
