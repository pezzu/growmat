var values = ["20h/4h", "18h/6h", "16h/8h", "12h/12h", "10h/14h", "8h/16h"];

$(document).ready(function () {
    function fillParams(data) {
        const controls = ['#light', '#ventilation', '#circulation']; 
        controls.forEach(ctrl => $(ctrl).off('change'));

        $('#temperature').text(data.temperature);
        $('#humidity').text(data.humidity);
        $('#dawn').text(data.dawn);
        $('#sunset').text(data.sunset);
        $('#light').bootstrapToggle(data.light ? 'on' : 'off');
        $('#ventilation').bootstrapToggle( data.ventilation ? 'on' : 'off');
        $('#circulation').bootstrapToggle(data.circulation ? 'on' : 'off');
        $('#daylightHours').selectpicker('val', data.daylightHours);

        controls.forEach(ctrl => $(ctrl).change(onToggle));
    }

    function onToggle() {
        const params = {};
        params[this.id] = $(this).prop('checked') ? 1 : 0;
        $.post('api/params.json', { params: params }, fillParams);
    }

    function onSelectDayHours() {
        const params = {};
        params[this.id] = $(this).val();
        $.post('api/params.json', { params: params }, fillParams);    
    }
/*
    $(".toggle-btn").click(
        function(){
            $(this).find("img").toggleClass("desaturated");
        }
    );

	$('#ex1').slider({
		formatter: function(value) {
            $("#day-night-value h2").text(values[value]);
			return 'Current value: ' + values[value];
		}
	});
*/
    // show spinner

    $('#daylightHours').change(onSelectDayHours);

    $.getJSON('api/params.json', fillParams);
});