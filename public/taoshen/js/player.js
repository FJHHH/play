$(document).ready(init());

function init () {
	!function(){
		$(document).delegate('.comment-send .comment-input','focusin', function () {
			console.log('1111');
			var parent = $(this).parent();
			console.log(parent);
			$(parent).addClass('on');
		});
		$(document).delegate('.comment-send .comment-input','focusout', function () {
			console.log('1111');
			var parent = $(this).parent();
			console.log(parent);
			$(parent).removeClass('on');
		});
	}();
	!function() {
		var t;
		$('.toolbar .initialized').hover(function(){
			var obj = this;
			t = setTimeout(function(obj){
				children = $(obj).children('.copyinit');
				$(children).stop();
				$(children).slideDown();
			},200,obj);
		},function(){
			clearTimeout(t);
			children = $(this).children('.copyinit');
			$(children).stop();
			$(children).slideUp();
		});
	}();

	!function () {
		$('.c-order .order').bind('click',function () {
			$('.c-order .order').removeClass('active');
			$(this).addClass('active');
            var order = $(this).attr('order');
			_getCByOrder(order);
		});
        
        function _getCByOrder (order) {
            //TODO ajax
        }
	}();
}