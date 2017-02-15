/**
 * Created by FJH on 2017/2/14.
 */
$(function () {
    //header
    var $links = $('header .nav-links .link');
    $links.hover(function () {
        $('header .nav-links .nav-slide').stop().animate({
            left: $(this).position().left
        }, 300);
    }, function () {
        $('header .nav-links .nav-slide').stop().animate({
            left: $('header .nav-links .link.active').position().left
        }, 300);
    });
    var $sections = $('section');
    $links.click(function () {
        var $window = $(window);
        $window.unbind('scroll');
        var $this = $(this);
        var index = $this.index();
        $this.addClass('active').siblings().removeClass('active');
        $('body').animate({
            scrollTop: $sections.eq(index).offset().top
        }, 300, function () {
            $window.bind('scroll', scrollHandler);
        });
    });
    //滚动监听
    var scrollHandler = function () {
        var scrollTop = $('body').scrollTop();
        $sections.each(function (index, item) {
            var $item = $(item);
            var top = $item.offset().top;
            var nexttop = $item.next().offset().top;
            if (scrollTop >= top && scrollTop <= nexttop) {
                $links.eq(index).addClass('active').siblings().removeClass('active');
                $('header .nav-links .nav-slide').stop().animate({
                    left: $('header .nav-links .link.active').position().left
                }, 300);
            }
        });

        if($(window).scrollTop() >= 350){
            $('.ability-list h4').eq(0).animate({
                'width' : '80%'
            });
            $('.ability-list h4').eq(1).animate({
                'width' : '75%'
            });
            $('.ability-list h4').eq(2).animate({
                'width' : '60%'
            });
            $('.ability-list h4').eq(3).animate({
                'width' : '60%'
            });
        }
    };
    $(window).bind('scroll', scrollHandler);

    //aboutme
    var $aboutme = $('#aboutme');

    var $slides = $aboutme.find('.slides .slide');
    $slides.each(function (index, item) {
        var $item = $(item);
        $item.css('left', $item.width() * index + 'px');
    });

    !function () {
        var $aboutmetemp = $aboutme;
        var $slidestep = $slides;
        var index = 0;
        var count = $slidestep.length;
        var duration = 500;
        var width = $slidestep.width();
        var $points = $aboutmetemp.find('.points .point');
        $points.click(function () {
            $(this).addClass('active').siblings().removeClass('active');
            var index2 = $(this).index();
            index = index2;
            $aboutmetemp.find('.slides').animate({
                'left': -index * width + 'px'
            }, duration);
        });

        $(window).resize(function () {
            $slides.each(function (index, item) {
                var $item = $(item);
                width = $item.width();
                $(item).css('left', width * index + 'px');
            });
            $aboutmetemp.find('.slides').css({
                'left': -index * width + 'px'
            });
        });
        $aboutmetemp.find('.btns .pre').click(function () {
            index = (index + count - 1) % count;
            console.log(index);
            $points.eq(index).click();
        });

        $aboutmetemp.find('.btns .next').click(function () {
            index = (index + 1) % count;
            console.log(index);
            $points.eq(index).click();
        });
    }();
});