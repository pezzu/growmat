$(document).ready(function () {
 
    function fillParams(data) {
        const controls = ['#light', '#ventilation', '#circulation']; 
        controls.forEach(ctrl => $(ctrl).off('change'));

        $('#temperature').text(data.temperature);
        $('#humidity').text(data.humidity);
        $('#light').bootstrapToggle(data.light ? 'on' : 'off');
        $('#ventilation').bootstrapToggle( data.ventilation ? 'on' : 'off');
        $('#circulation').bootstrapToggle(data.circulation ? 'on' : 'off');
        $('#daylightHours').val(data.daylightHours);

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

    // show spinner

    $('#daylightHours').change(onSelectDayHours);

    $.getJSON('api/params.json', fillParams);
});