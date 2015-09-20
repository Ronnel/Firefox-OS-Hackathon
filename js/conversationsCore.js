
var conversationsCore = {
                timer: {},
                is_recording: false,
                contact_details: {},
                timer_elem: "",
                start_time: 0
        };

conversationsCore.initialise = function(elem){
            conversationsCore.timer_elem = elem;
        }

conversationsCore.startRecording = function(){
            conversationsCore.start_time = new Date();
            Android.startRecord();
            conversationsCore.is_recording = true;
            conversationsCore.timer = window.setInterval( conversationsCore.timerCallback, 100 );
        }

conversationsCore.stopRecording = function(){
            window.clearInterval(conversationsCore.timer);
            Android.stopRecord();
            conversationsCore.is_recording = false;
            $('#circles, .light').fadeOut();
        }

conversationsCore.timerCallback = function(){
            var endTime = new Date();
            var time = Math.floor((endTime - conversationsCore.start_time)/1000);

            $(conversationsCore.timer_elem).html(time+"<span class='small'>/15</span>");

            if(time == 15){
                conversationsCore.stopRecording();
                Android.openNewPage("send.html", JSON.stringify({
                    me: Parse.User.current().id,
                    friends: friends,
                    my_name: Parse.User.current().attributes.name
                }));
            }
        }