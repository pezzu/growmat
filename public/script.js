$(document).ready(function () {
 
    function fillParams(data) {
        const controls = ['#light', '#ventilation', '#circulation']; 
        
        controls.forEach(ctrl => $(ctrl).off('change'));

        $('#temperature').append(data.temperature);
        $('#humidity').append(data.humidity);
        $('#light').bootstrapToggle(data.light ? 'on' : 'off');
        $('#ventilation').bootstrapToggle( data.ventilation ? 'on' : 'off');
        $('#circulation').bootstrapToggle(data.circulation ? 'on' : 'off');
        
        controls.forEach(ctrl => $(ctrl).change(onToggle));
    }

    function onToggle() {
        const params = {};
        params[this.id] = $(this).prop('checked') ? 1 : 0;
        $.post('api/params.json', { params: params }, fillParams);    
    }

    // show spinner

    $.getJSON('api/params.json', fillParams);
  
    
  
    
});