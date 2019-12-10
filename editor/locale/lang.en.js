export default {
  lang: 'en',
  dir: 'ltr',
  common: {
    ok: 'OK',
    cancel: 'Cancel',
    key_backspace: 'Backspace',
    key_del: 'Del',
    key_down: 'Down',
    key_up: 'Up',
    more_opts: 'More options',
    url: 'URL',
    width: 'Width',
    height: 'Height'
  },
  misc: {
    powered_by: 'Powered by'
  },
  ui: {
    toggle_stroke_tools: 'Show/hide more stroke tools',
    palette_info: 'Click to change fill color, shift-click to change stroke color',
    zoom_level: 'Change zoom level',
    panel_drag: 'Drag left/right to resize side panel',
    quality: 'Quality:',
    pathNodeTooltip: 'Drag node to move it. Double-click node to change segment type',
    pathCtrlPtTooltip: 'Drag control point to adjust curve properties',
    pick_stroke_paint_opacity: 'Pick a Stroke Paint and Opacity',
    pick_fill_paint_opacity: 'Pick a Fill Paint and Opacity',
    pick_solid_color_tab: "Solid Color",
    pick_linear_gradient_tab: "Linear Gradient",
    pick_radial_gradient_tab: "Radial Gradient",
    pick_begin_point: "Begin point",
    pick_end_point: "End point",
    pick_center_point: "Center point",
    pick_focal_point: "Focal point",
    pick_ok: "OK",
    pick_cancel: "Cancel",
    pick_lbl_radius: "Radius:",
    pick_title_radius: "Click to set radius",
    pick_title_ellip: "Click to set Ellip",
    pick_title_angle: "Click to set Angle",
    pick_title_opac: "Click to set Opac",
    pick_title_x1: "Enter starting x value between 0.0 and 1.0",
    pick_title_y1: "Enter starting y value between 0.0 and 1.0",
    pick_title_x2: "Enter ending x value between 0.0 and 1.0",
    pick_title_y2: "Enter ending y value between 0.0 and 1.0",
    pick_title_x3: "Enter x value between 0.0 and 1.0",
    pick_title_y3: "Enter y value between 0.0 and 1.0",
    pick_spread_method: "Spread method",
    pick_option_pad: "Pad",
    pick_option_reflect: "Reflect",
    pick_option_repeat: "Repeat",
    pick_lbl_angle: "Angle:",
    pick_lbl_opac: "Opac:",
    pick_lbl_deg: "deg",
    ObjectId: "Object Id",
    Index: "Index",
    ThoiDiemBatDau: "Starting time",
    ThoiDiemKetThuc: "The end time",
    MaXa: "Commune Code",
    MaDoiTuong: "Object code",
    SoHieuToBanDo: "Map number",
    SoThuTuThua: "The parcel number",
    SoHieuToBanDoCu: "Old map number",
    SoThuTuThuaCu: "Old parcel number",
    DienTich: "Area",
    DienTichPhapLy: "Legal area",
    KyHieuMucDichSuDung: "Symbol of purpose of use",
    KyHieuDoiTuong: "Object symbol",
    TenChu: "Name",
    DiaChi: "Address",
    DaCapGCN: "Certified",
    TenChu2: "Owner name 2",
    NamSinhC1: "NamSinhC1",
    SoHieuGCN: "Certificate number",
    SoVaoSo: "Numbers in the book",
    NgayVaoSo: "Day to book",
    SoBienNhan: "Receipt number",
    NguoiNhanHS: "Recipient",
    CoQuanThuLy: "Agency accepting",
    LoaiHS: "Type of file",
    MaLienKet: "Affiliate code",
    info: "Information",
    Tags: "Tags",
    CreatedDate: "Created Date",
    UpdatedDate: "Updated date",
    selectProperty: "Select properties"
  },
  localization: {
    text: {
      title: 'Drag Markers To Pick A Color',
      newColor: 'new',
      currentColor: 'current',
      ok: 'OK',
      cancel: 'Cancel'
    },
    tooltips: {
      colors: {
        newColor: 'New Color - Press &ldquo;OK&rdquo; To Commit',
        currentColor: 'Click To Revert To Original Color'
      },
      buttons: {
        ok: 'Commit To This Color Selection',
        cancel: 'Cancel And Revert To Original Color'
      },
      hue: {
        radio: 'Set To &ldquo;Hue&rdquo; Color Mode',
        textbox: 'Enter A &ldquo;Hue&rdquo; Value (0-360&deg;)'
      },
      saturation: {
        radio: 'Set To &ldquo;Saturation&rdquo; Color Mode',
        textbox: 'Enter A &ldquo;Saturation&rdquo; Value (0-100%)'
      },
      value: {
        radio: 'Set To &ldquo;Value&rdquo; Color Mode',
        textbox: 'Enter A &ldquo;Value&rdquo; Value (0-100%)'
      },
      red: {
        radio: 'Set To &ldquo;Red&rdquo; Color Mode',
        textbox: 'Enter A &ldquo;Red&rdquo; Value (0-255)'
      },
      green: {
        radio: 'Set To &ldquo;Green&rdquo; Color Mode',
        textbox: 'Enter A &ldquo;Green&rdquo; Value (0-255)'
      },
      blue: {
        radio: 'Set To &ldquo;Blue&rdquo; Color Mode',
        textbox: 'Enter A &ldquo;Blue&rdquo; Value (0-255)'
      },
      alpha: {
        radio: 'Set To &ldquo;Alpha&rdquo; Color Mode',
        textbox: 'Enter A &ldquo;Alpha&rdquo; Value (0-100)'
      },
      hex: {
        textbox: 'Enter A &ldquo;Hex&rdquo; Color Value (#000000-#ffffff)',
        alpha: 'Enter A &ldquo;Alpha&rdquo; Value (#00-#ff)'
      }
    }
  },
  properties: {
    id: 'Identify the element',
    fill_color: 'Change fill color',
    stroke_color: 'Change stroke color',
    stroke_style: 'Change stroke dash style',
    stroke_width: 'Change stroke width by 1, shift-click to change by 0.1',
    pos_x: 'Change X coordinate',
    pos_y: 'Change Y coordinate',
    linecap_butt: 'Linecap: Butt',
    linecap_round: 'Linecap: Round',
    linecap_square: 'Linecap: Square',
    linejoin_bevel: 'Linejoin: Bevel',
    linejoin_miter: 'Linejoin: Miter',
    linejoin_round: 'Linejoin: Round',
    angle: 'Change rotation angle',
    blur: 'Change gaussian blur value',
    opacity: 'Change selected item opacity',
    circle_cx: "Change circle's cx coordinate",
    circle_cy: "Change circle's cy coordinate",
    circle_r: "Change circle's radius",
    ellipse_cx: "Change ellipse's cx coordinate",
    ellipse_cy: "Change ellipse's cy coordinate",
    ellipse_rx: "Change ellipse's x radius",
    ellipse_ry: "Change ellipse's y radius",
    line_x1: "Change line's starting x coordinate",
    line_x2: "Change line's ending x coordinate",
    line_y1: "Change line's starting y coordinate",
    line_y2: "Change line's ending y coordinate",
    rect_height: 'Change rectangle height',
    rect_width: 'Change rectangle width',
    corner_radius: 'Change Rectangle Corner Radius',
    image_width: 'Change image width',
    image_height: 'Change image height',
    image_url: 'Change URL',
    node_x: "Change node's x coordinate",
    node_y: "Change node's y coordinate",
    seg_type: 'Change Segment type',
    straight_segments: 'Straight',
    curve_segments: 'Curve',
    text_contents: 'Change text contents',
    font_family: 'Change Font Family',
    font_size: 'Change Font Size',
    bold: 'Bold Text [B]',
    italic: 'Italic Text [I]'
  },
  tools: {
    title_draw_property: "Draw plot properties",
    lbl_select_property: "Select properties:",
    shape_heart: "Heart",
    shape_frame: "Frame",
    shape_donut: "Donut",
    shape_triangle: "Triangle",
    shape_right_triangle: "Right triangle",
    shape_diamond: "Diamond",
    shape_pentagon: "Pentagon",
    shape_hexagon: "hexagon",
    shape_septagon1: "Septagon 1",
    shape_heptagon: "Heptagon",
    shape_decagon: "Decagon",
    shape_dodecagon: "Dodecagon",
    shape_star_points_5: "Star points 5",
    shape_trapezoid: "Trapezoid",
    shape_arrow_up: "Arrow up",
    shape_vertical_scrool: "Vertical scrool",
    shape_smiley: "Smiley",
    shape_left_braket: "Left braket",
    shape_uml_actor: "UML actor",
    shape_dialog_balloon_1: "Dialog balloon 1",
    shape_cylinder: "Cylinder",
    shape_arrow_u_turn: "Arrow u turn",
    shape_arrow_left_up: "Arrow left up",
    shape_maximize: "Maximize",
    shape_cross: "Cross",
    shape_plaque: "Plaque",
    shape_page: "Page",
    searchSVG: "Search",
    searchSVG_title: "Search SVG of plot",
    tool_toggle_adjacent: 'Toogle Adjacent [T]',
    ma_xa: 'Cadastral code: ',
    so_to: 'Number of sheets: ',
    so_thua: 'Number of plots: ',
    main_menu: 'Main Menu',
    bkgnd_color_opac: 'Change background color/opacity',
    connector_no_arrow: 'No arrow',
    fitToContent: 'Fit to Content',
    fit_to_all: 'Fit to all content',
    fit_to_canvas: 'Fit to canvas',
    fit_to_layer_content: 'Fit to layer content',
    fit_to_sel: 'Fit to selection',
    align_relative_to: 'Align relative to ...',
    relativeTo: 'relative to:',
    page: 'page',
    largest_object: 'largest object',
    selected_objects: 'selected objects',
    smallest_object: 'smallest object',
    new_doc: 'New Image',
    open_doc: 'Open SVG',
    export_img: 'Export',
    prefsopt: 'Editor options',
    save_doc: 'Save Image',
    save_database: 'Save to Database',
    import_doc: 'Import Image',
    align_to_page: 'Align Element to Page',
    align_bottom: 'Align Bottom',
    align_center: 'Align Center',
    align_left: 'Align Left',
    align_middle: 'Align Middle',
    align_right: 'Align Right',
    align_top: 'Align Top',
    mode_select: 'Select Tool',
    mode_fhpath: 'Pencil Tool',
    mode_line: 'Line Tool',
    mode_rect: 'Rectangle Tool',
    mode_square: 'Square Tool',
    mode_fhrect: 'Free-Hand Rectangle',
    mode_ellipse: 'Ellipse',
    mode_circle: 'Circle',
    mode_fhellipse: 'Free-Hand Ellipse',
    mode_path: 'Path Tool',
    mode_text: 'Text Tool',
    mode_image: 'Image Tool',
    mode_zoom: 'Zoom Tool [Ctrl+Up/Down]',
    no_embed: 'NOTE: This image cannot be embedded. It will depend on this path to be displayed',
    undo: 'Undo [Z]',
    redo: 'Redo [Y]',
    tool_source: 'Edit Source [U]',
    wireframe_mode: 'Wireframe Mode [F]',
    clone: 'Duplicate Element(s) [D]',
    del: 'Delete Element(s) [Delete/Backspace]',
    group_elements: 'Group Elements [G]',
    make_link: 'Make (hyper)link',
    set_link_url: 'Set link URL (leave empty to remove)',
    to_path: 'Convert to Path',
    reorient_path: 'Reorient path',
    ungroup: 'Ungroup Elements',
    docprops: 'Document Properties [D]',
    move_bottom: 'Send to Back',
    move_top: 'Bring to Front',
    node_clone: 'Clone Node',
    node_delete: 'Delete Node',
    node_link: 'Link Control Points',
    add_subpath: 'Add sub-path',
    openclose_path: 'Open/close sub-path',
    source_save: 'Apply Changes',
    cut: 'Cut',
    copy: 'Copy',
    paste: 'Paste',
    paste_in_place: 'Paste in Place',
    delete: 'Delete',
    group: 'Group',
    move_front: 'Bring to Front',
    move_up: 'Bring Forward',
    move_down: 'Send Backward',
    move_back: 'Send to Back'
  },
  layers: {
    layer: 'Layer',
    layers: 'Layers',
    del: 'Delete Layer',
    move_down: 'Move Layer Down',
    new: 'New Layer',
    rename: 'Rename Layer',
    move_up: 'Move Layer Up',
    dupe: 'Duplicate Layer...',
    merge_down: 'Merge Down',
    merge_all: 'Merge All',
    move_elems_to: 'Move elements to:',
    move_selected: 'Move selected elements to a different layer'
  },
  config: {
    image_props: 'Image Properties',
    doc_title: 'Title:',
    doc_dims: 'Canvas Dimensions',
    included_images: 'Included Images',
    image_opt_embed: 'Embed data (local files)',
    image_opt_ref: 'Use file reference',
    editor_prefs: 'Editor Preferences',
    icon_size: 'Icon size:',
    language: 'Language:',
    background: 'Editor Background',
    editor_img_url: 'Image URL:',
    editor_bg_note: 'Note: Background will not be saved with image.',
    icon_large: 'Large',
    icon_medium: 'Medium',
    icon_small: 'Small',
    icon_xlarge: 'Extra Large',
    select_predefined: 'Select predefined:',
    units_and_rulers: 'Units & Rulers',
    show_rulers: 'Show rulers',
    base_unit: 'Base Unit:',
    grid: 'Grid',
    snapping_onoff: 'Snapping on/off',
    snapping_stepsize: 'Snapping Step-Size:',
    grid_color: 'Grid color:'
  },
  notification: {
    invalidAttrValGiven: 'Invalid value given',
    noContentToFitTo: 'No content to fit to',
    dupeLayerName: 'There is already a layer named that!',
    enterUniqueLayerName: 'Please enter a unique layer name',
    enterNewLayerName: 'Please enter the new layer name',
    layerHasThatName: 'Layer already has that name',
    QmoveElemsToLayer: 'Move selected elements to layer \'%s\'?',
    QwantToClear: 'Do you want to clear the drawing?\nThis will also erase your undo history!',
    QwantToOpen: 'Do you want to open a new file?\nThis will also erase your undo history!',
    SaveSuccess: 'Save SVG to database sucess!',
    SaveFail: 'Save SVG to database fail!',
    NotFound: 'Not found SVG!',
    SearchLoDat: 'The parcel you are looking for with the sheet number is \'%sto\', the parcel number is \'%sth\' and the commune code \'%mxa\' has been saved in the database. \nDo you want to open a saved? ? \nSelect "OK" to open the saved \nSelect "Cancel" to create a new version ',
    SearchEmpty: 'Please enter value for Number of sheets, Number of plots And Cadastral code!',
    QerrorsRevertToSource: 'There were parsing errors in your SVG source.\nRevert back to original SVG source?',
    QignoreSourceChanges: 'Ignore changes made to SVG source?',
    featNotSupported: 'Feature not supported',
    enterNewImgURL: 'Enter the new image URL',
    defsFailOnSave: 'NOTE: Due to a bug in your browser, this image may appear wrong (missing gradients or elements). It will however appear correct once actually saved.',
    loadingImage: 'Loading image, please wait...',
    saveFromBrowser: "Select 'Save As...' in your browser (possibly via file menu or right-click context-menu) to save this image as a %s file.",
    noteTheseIssues: 'Also note the following issues: ',
    unsavedChanges: 'There are unsaved changes.',
    enterNewLinkURL: 'Enter the new hyperlink URL',
    errorLoadingSVG: 'Error: Unable to load SVG data',
    URLLoadFail: 'Unable to load from URL',
    retrieving: "Retrieving '%s' ...",
    popupWindowBlocked: 'Popup window may be blocked by browser',
    exportNoBlur: 'Blurred elements will appear as un-blurred',
    exportNoforeignObject: 'foreignObject elements will not appear',
    exportNoDashArray: 'Strokes will appear filled',
    exportNoText: 'Text may not appear as expected'
  }
};
