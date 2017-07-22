$(document).ready(function () {
 
    function fillParams(data) {
        $('#temperature').append(data.temperature);
        $('#humidity').append(data.humidity);
        
        $('#light').off("change");
        $('#ventilation').off("change");
        $('#circulation').off("change");

        $('#light').bootstrapToggle(data.light ? 'on' : 'off');
        $('#ventilation').bootstrapToggle( data.ventilation ? 'on' : 'off');
        $('#circulation').bootstrapToggle(data.circulation ? 'on' : 'off');
        
        $('#light').change(onToggle);
        $('#ventilation').change(onToggle);
        $('#circulation').change(onToggle);
    }

    function onToggle() {
        const params = {};
        params[this.id] = $(this).prop('checked') ? 1 : 0;
        $.post('api/params.json', { params: params }, fillParams);    
    }

    $.getJSON('api/params.json', fillParams);
  
    // show spinner
  
    


//   $('#get-data').click(function () {
//     var showData = $('#show-data');

//     $.getJSON('example.json', function (data) {
//       console.log(data);

//       var items = data.items.map(function (item) {
//         return item.key + ': ' + item.value;
//       });

//       showData.empty();

//       if (items.length) {
//         var content = '<li>' + items.join('</li><li>') + '</li>';
//         var list = $('<ul />').html(content);
//         showData.append(list);
//       }
//     });

//     showData.text('Loading the JSON file.');
//   });
});