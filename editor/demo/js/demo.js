var codeText = document.getElementById('code-text');
var sheetText = document.getElementById('sheet-text');
var parcelText = document.getElementById('parcel-text');
var btnConvert = document.getElementById('btn-convert');
btnConvert.addEventListener('click', convert);

function convert() {
  var code = codeText.value;
  var sheetNum = sheetText.value;
  var parcelNum = parcelText.value;

  // After convert geojson to svg then open svg editor dialog
  $("#dialog").dialog({
    title: 'BIÊN TẬP SƠ ĐỒ THỬA ĐẤT',
    autoOpen: false,
    modal: true,
    width: 1200,
    height: 800,
    open: function(ev, ui){
      $('#svgEditor').attr('src',`http://localhost:8000/editor/svg-editor-es.html?maXa=${code}&soTo=${sheetNum}&soThua=${parcelNum}`);
    }
  });

  $('#dialog').dialog('open');

  $('svg-editor').css({ display: "block" });
}