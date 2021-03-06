/*!
 * jQuery Custom Radio Checkbox Plugin
 * Copyright (c) 2012-2014 Denis Ciccale (@tdecs)
 * Released under MIT license (https://raw.github.com/dciccale/Custom-radio-checkbox/master/LICENSE.txt)
 */
/*
 * UpDate  On 20161222  By haoxj@xinfushe.com
 * newGitAdress (https://github.com/mrhaoxiaojun/custom-radio-checkbox)
 */
var  rdsCache;
(function($) {
    $.fn.customRadioCheckbox = function(options) {
        // don't act on absent elements, can't chain anyway
        if (!this[0]) {
            return;
        }

        // checked suffix
        var checkedSuffix = '-checked';

        // css class used to hide inputs
        var hiddenInputClass = 'rc-hidden';

        // function to force the input change when clicking
        // on a fake input that is not wrapped by a label tag
        var forceChange = function() {
            var $this = $(this);
            // only trigger if the input is not inside a label
            if (!$this.closest('label')[0]) {
                $this.prev().trigger('change.crc', [true]);
            }
        };

        /*
         *插入伪造的input，即i标签
         * function that inserts the fake input
         */
        var insertFakeInput = function(inputs) {

            var type = inputs.type;
            var l = inputs.length;
            var fakeInputElem, input;
            while (l--) {
                // current input
                input = inputs[l];
                // fake input
                fakeInputElem = $('<i>')
                    .addClass(type + (input.checked ? ' ' + type + checkedSuffix : ''))
                    .bind('click.crc', forceChange);

                // insert the fake input after the input
                input.parentNode.insertBefore(fakeInputElem[0], input.nextSibling);
            }
        };

        return this.each(function() {

            var $context = $(this);

            // find & hide radios
            var rds = $context.find('input[type=radio]:not(.' + hiddenInputClass + ')')
                .addClass(hiddenInputClass);
            // find & hide checkboxes
            var chs = $context.find('input[type=checkbox]:not(.' + hiddenInputClass + ')')
                .addClass(hiddenInputClass);

            // storage for each radio group to optimize next lookup
            window.rdsCache = $.extend(rdsCache,{});

            // total radios
            var rdsLength = rds.length;
            var chsLength = chs.length;
            var rd, ch;

            // 单选按钮-----only apply if there are radios
            if (rds.length) {
                rds.type = 'radio';

                // insert each fake radio
                insertFakeInput(rds);

                // initialize rdsCache for prechecked inputs
                while (rdsLength--) {
                    rd = rds[rdsLength];
                    if (rd.checked) {
                        (rdsCache[rd.name] = {}).checked = $(rd.nextSibling);
                    }
                     if ($(rd).prop("disabled")) {
                        if ($(rd).prop("checked")) {
                            $(rd.nextSibling).addClass('radio-checked-disabled')
                        }else{
                            $(rd.nextSibling).addClass('radio-disabled')
                        }
                    }
                }

                // bind radio change event
                rds.bind('change.crc', function(e, force) {
                    if (this.disabled) {
                        return;
                    }

                    // uncheck previous and remove checked class
                    if (!force || !this.checked) {

                        // filter by name and remove class from the last radio checked
                        // save this collection in cache obj for faster use
                        if (!rdsCache[this.name]) {
                            rdsCache[this.name] = {};
                        }

                        // uncheck last checked from this group
                        if (rdsCache[this.name].checked) {
                            rdsCache[this.name].checked.removeClass(rds.type + checkedSuffix);
                        }

                        // add checked class to this input and save it as checked for this group
                        rdsCache[this.name].checked = $(this.nextSibling).addClass(rds.type + checkedSuffix);
                    }

                    // if force set to true and is not already checked, check the input
                    if (force && !this.checked) {
                        this.checked = true;
                    }
                });
            }

            // 复选按钮-----only apply if there are checkboxes
            if (chs.length) {
                chs.type = 'checkbox';

                // insert each fake checkbox
                insertFakeInput(chs);
                // 添加disabled 图片
                while (chsLength--) {
                    ch = chs[chsLength];
                    if ($(ch).prop("disabled")) {
                        if ($(ch).prop("checked")) {
                            $(ch.nextSibling).addClass('checkbox-checked-disabled')
                        }else{
                            $(ch.nextSibling).addClass('checkbox-disabled')
                        }
                    } 
                }
                // bind checkbox change event
                chs.bind('change.crc', function(e, force) {
                    // force change state
                    if (this.disabled) {
                        return;
                    }
                    if (force) {
                        this.checked = !this.checked;
                    }

                    // toggle checked class
                    $(this.nextSibling).toggleClass(chs.type + checkedSuffix);
                });
            }
        });
    };

    // auto-init the plugin
    $(function() {
        $('body').customRadioCheckbox();
    });
}(jQuery));
