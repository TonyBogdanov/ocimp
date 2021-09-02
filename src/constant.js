const constant = {

    RESIZE_NEAREST_NEIGHBOR: 'nearestNeighbor',
    RESIZE_BILINEAR: 'bilinearInterpolation',
    RESIZE_BICUBIC: 'bicubicInterpolation',
    RESIZE_HERMITE: 'hermiteInterpolation',
    RESIZE_BEZIER: 'bezierInterpolation',

    ALIGN_LEFT: 'left',
    ALIGN_CENTER: 'center',
    ALIGN_RIGHT: 'right',

    ALIGN_TOP: 'top',
    ALIGN_MIDDLE: 'middle',
    ALIGN_BOTTOM: 'bottom',

};

constant.RESIZE_MODES = [

    constant.RESIZE_NEAREST_NEIGHBOR,
    constant.RESIZE_BILINEAR,
    constant.RESIZE_BICUBIC,
    constant.RESIZE_HERMITE,
    constant.RESIZE_BEZIER,

];

constant.HORIZONTAL_ALIGNS = [ constant.ALIGN_LEFT, constant.ALIGN_CENTER, constant.ALIGN_RIGHT ];
constant.VERTICAL_ALIGNS = [ constant.ALIGN_TOP, constant.ALIGN_MIDDLE, constant.ALIGN_BOTTOM ];

export default constant;
