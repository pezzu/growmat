$(document).ready(function () {
 
    function fillParams(data) {
        $('#temperature').append(data.temperature);
        $('#humidity').append(data.humidity);
        $('#light').bootstrapToggle(data.light? 'on' : 'off');
        $('#ventilation').bootstrapToggle(data.ventilation? 'on' : 'off');
        $('#circulation').bootstrapToggle(data.circulation? 'on' : 'off');
    }

    $.getJSON('api/params.json', fillParams);
  
    // show spinner
  
    $('#light').change(function () {
        $.post('api/params.json',
            {
                params: {
                    light: $(this).prop('checked') ? 1 : 0
                }
            },
            function (data) {
                console.log("data: " + data.light);    
            });
    });
    


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