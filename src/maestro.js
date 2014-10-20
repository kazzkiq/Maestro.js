$(function(){
	initMaestro();
});

//do all the actions
function actionExecuter(action,el){
	action = action.split("|");
	var delay = parseInt(action[2]),
		target = action[1],
		callback = action[3],
		action = action[0];

	if(+delay > 0 && typeof(delay) == "number"){
		loaderOpen();
	}

	if(target == "this"){
		target = el;
	}else{
		el = $(target);
	}

	//delay
	setTimeout(function(){
		//close the loader after the delay
		loaderClose();

		//then do the actions
		if(action == "redirect"){
			$(location).attr('href',target);
		}

		if(action == "alert"){
			alert(target);
		}

		if(action == "log"){
			console.log(target);
		}

		if(action == "show"){
			$(target).show();
		}

		if(action == "hide"){
			$(target).hide();
		}

		if(action == "fadeOut"){
			$(target).fadeOut();
		}

		if(action == "disable"){
			$(target).prop('disabled',true);
		}

		if(action == "enable"){
			$(target).prop('disabled',false);
		}

		//and run the callback (if there is any)
		if(callback){
			window[callback](el);
		}

	},delay);
}


//just a function to handle the loader open event
function loaderOpen(){
	if($('#maestro-loader').length > 0){
		$('#maestro-loader').remove();
	}
	$('body').append('<div id="maestro-loader"></div>');
	var target = document.getElementById('maestro-loader');
	var spinner = new Spinner().spin(target);
}

//same above, but for close
function loaderClose(){
	$('#maestro-loader').remove();
}

//listen for confirms
function listenerConfirm(){
	$('*[data-confirm]').each(function(){
		var it = $(this),
			trigger = it.data('trigger');
		if(!trigger){
			trigger = "tap";
		}
		$(it).hammer().on(trigger,function(){
				c = confirm(it.data('confirm'));
			if(c){
				actionExecuter(it.data('onconfirm'),it);
			}
		});
	});
}

//listen for any action
function listenerAction(){
	$('*[data-action]').each(function(){
		var it = $(this),
			trigger = it.data('trigger');
		if(!trigger){
			trigger = "tap";
		}
		$(it).hammer().on(trigger,function(){
			actionExecuter(it.data('action'),it);
			//console.log(it.data('action'))
		});
	});
}

//listener for timer
function listenerTimer(){
	$('*[data-timer]').not('*[timer-start="true"],*[stop]').each(function(){
		var it = $(this),
			trigger = it.data('trigger');
		if(!trigger || trigger == "auto"){
			runTimer(it);
		}else{
			$(it).hammer().on(trigger,function(){
				runTimer(it);
			});
		}

	});
}

function runTimer(el){
    el.attr('timer-start','true');
	var timestart = el.data('timer'),
		hour = 0,
		minute = 0,
		second = 0;

	if(timestart){	
		timestart = timestart.split(":");
		hour = timestart[0],
		minute = timestart[1],
		second = timestart[2];
	}

	//sets default attributes to work with on setInterval
	el.attr('timer-hour',hour);
	el.attr('timer-minute',minute);
	el.attr('timer-second',second);

	//set the innerHTML to the default timer
	var time = hour+":"+minute+":"+second;
	el.html(time);

	//run the timer
	setInterval(function(){
		second = +el.attr('timer-second')+1;
		if(second > 59){
			second = 0;
			el.attr('timer-minute',+el.attr('timer-minute')+1);
		}
		el.attr('timer-second',second);

		minute = +el.attr('timer-minute');
		if(minute > 59){
			minute = 0;
			el.attr('timer-hour',+el.attr('timer-hour')+1);
		}
		el.attr('timer-minute',minute);

		hour = +el.attr('timer-hour');
		if(hour > 59){
			hour = 0;
			el.attr('timer-minute',"0");
		}
		el.attr('timer-hour',hour);


		if(hour < 10){hour = "0"+hour}
		if(minute < 10){minute = "0"+minute}
		if(second < 10){second = "0"+second}

		time = hour+":"+minute+":"+second;
		el.html(time);
	},1000);
}

function maskListener(){
	$('*[data-mask]').each(function(){
		doMask($(this));
	});
}

function doMask(el){
	var mask,
		request = el.data('mask');

	if(request == "date"){
		mask = "99/99/9999";
	}

	if(request == "datetime"){
		mask = "99/99/9999 99:99:99";
	}

	if(request == "cpf"){
		mask = "999.999.999-99";
	}

	if(request == "codigo-loja"){
		mask = "9999";
	}

	if(request == "phone"){
		mask = "9999-9999";
	}

	if(request == "cep"){
		mask = "99999-999";
	}
    
    if(request == "ddd"){
        mask = "(99)";
    }

	el.mask(mask);
}

function initMaestro(){
	//getTrigger();
	listenerConfirm();
	listenerAction();
	listenerTimer();
    maskListener();
	console.log("Maestro.js initiated.");
}