(function($) {

    $(document).ready(function() {

        // подсказка в поле поиска
        $('.catalogue-search-input input').each(function() {
            if ($(this).val() == '') {
                $(this).parent().find('span').css({'display': 'block'});
            } else {
                $(this).parent().find('a').css({'display': 'block'});
            }
        });

        $('.catalogue-search-input input').focus(function() {
            $(this).parent().find('span').css({'display': 'none'});
        });

        $('.catalogue-search-input input').blur(function() {
            if ($(this).val() == '') {
                $(this).parent().find('span').css({'display': 'block'});
            }
        });

        $('.catalogue-search-input input').keyup(function() {
            if ($(this).val() == '') {
                $(this).parent().find('a').css({'display': 'none'});
            } else {
                $(this).parent().find('a').css({'display': 'block'});
            }
        });

        $('.catalogue-search-input a').click(function() {
            $(this).parent().find('input').val('').focus();
            $(this).parent().find('a').css({'display': 'none'});
            return false;
        });

        // табы на главной
        $('.catalogue-tabs a').click(function() {
            var curLi = $(this).parent();
            if (!curLi.hasClass('active')) {
                var curIndex = $('.catalogue-tabs li').index(curLi);
                $('.catalogue-tabs li.active').removeClass('active');
                curLi.addClass('active');
                $('.catalogue-content').removeClass('active');
                $('.catalogue-content').eq(curIndex).addClass('active');
            }
            return false;
        });

        // показать все
        $('.catalogue-all a').click(function() {
            var curLink = $(this);
            $.ajax({
                url: curLink.attr('href'),
                dataType: 'html'
            }).done(function(html) {
                curLink.parents().filter('.catalogue-content').find('.catalogue-list').append(html);
                curLink.parent().remove();
            });
            return false;
        });

        // стилизация селектов
        if ($('select').length > 0) {
            var params = {
                changedEl: 'select',
                visRows: 5,
                scrollArrows: true
            }
            cuSel(params);
        }

        // форма
        $('article form').each(function() {
            var curForm = $(this);
            curForm.find('input[name="phone"]').mask('+7 999 999-99-99');
            curForm.validate({
                invalidHandler: function(form, validator) {
                    validator.showErrors();
                    var textErrors = '';
                    $('.form-input input.error, .form-textarea textarea.error').each(function() {
                        var curField = $(this).parent().parent();
                        textErrors += '<p>Неправильно заполнено поле: ' + curField.find('.form-label').html() + '</p>';
                    });
                    if (textErrors != '') {
                        $('.form-errors').html(textErrors);
                        $('.form-errors').find('span').remove();
                        $('.form-errors').show();
                    } else {
                        $('.form-errors').html('').hide();
                    }
                }
            });
        });

        // описание презентации
        $('.presentation-text-link a').click(function() {
            var curLink = $(this);
            var curText = curLink.find('em').html();
            curLink.find('em').html(curLink.attr('rel'));
            curLink.attr('rel', curText);
            $('.presentation-text-inner').toggle();
            curLink.parent().find('span').toggleClass('active');
            return false;
        });

        // окно слайдов
        $('.presentation-slides a').click(function() {
            var curIndex = $('.presentation-slides a').index($(this));
            windowOpen($('.window-slides').html());
            $('.window .window-slides-preview-list a').eq(curIndex).trigger('click');
            $('.window .window-slides-preview').jScrollPane({showArrows: true});
            return false;
        });

        $('.presentation-photo a').click(function() {
            var curIndex = 0;
            windowOpen($('.window-slides').html());
            $('.window .window-slides-preview-list a').eq(curIndex).trigger('click');
            $('.window .window-slides-preview').jScrollPane({showArrows: true});
            return false;
        });

        $('.window .window-slides-preview-list a').live('click', function() {
            var curLink = $(this);
            if (!curLink.hasClass('active')) {
                $('.window .window-slides-preview-list a.active').removeClass('active');
                curLink.addClass('active');
                $('.window .window-slides-big img').attr('src', curLink.attr('href'));
            }
            return false;
        });

    });

    // открытие окна
    function windowOpen(contentWindow) {
        var windowWidth  = $(window).width();
        var windowHeight = $(window).height();
        var curScrollTop = $(window).scrollTop();

        $('body').css({'width': windowWidth, 'height': windowHeight, 'overflow': 'hidden'});
        $(window).scrollTop(0);
        $('.wrapper').css({'top': -curScrollTop});
        $('.wrapper').data('scrollTop', curScrollTop);

        $('body').append('<div class="window"><div class="window-overlay"></div><div class="window-container">' + contentWindow + '<a href="#" class="window-close"></a></div></div>')
        recalcWindow();

        $('.window-overlay').click(function() {
            windowClose();
        });

        $('.window-close').click(function() {
            windowClose();
            return false;
        });

        $('body').bind('keypress keydown', keyDownBody);
    }

    // функция обновления позиции окна
    function recalcWindow() {
        var windowWidth  = $(window).width();
        var windowHeight = $(window).height();
        if ($('.window-container').width() + 26 < windowWidth) {
            $('.window-container').css({'margin-left': -$('.window-container').width() / 2});
            $('.window-overlay').width(windowWidth);
        } else {
            $('.window-container').css({'left': 0});
            $('.window-overlay').width($('.window-container').width() + 26);
        }
        if ($('.window-container').height() + 80 < windowHeight) {
            $('.window-container').css({'margin-top': -$('.window-container').height() / 2});
            $('.window-overlay').height(windowHeight);
        } else {
            $('.window-container').css({'top': 40});
            $('.window-overlay').height($('.window-container').height() + 80);
        }
    }

    // обработка Esc после открытия окна
    function keyDownBody(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    }

    // закрытие окна
    function windowClose() {
        $('body').unbind('keypress keydown', keyDownBody);
        $('.window').remove();
        $('.wrapper').css({'top': 'auto'});
        $('body').css({'width': 'auto', 'height': '100%', 'overflow': 'auto'});
        var curScrollTop = $('.wrapper').data('scrollTop');
        $(window).scrollTop(curScrollTop);
    }

})(jQuery);