/**
 * [SvgAnimation SVG path animation]
 * @param {[javascript function]} 
 * @usage
 * ==================================
    var svgAnimSettings = {
        "elem" : "#svg-circle",
        "increaseBy" : 3,
        "timeout" : 1,
        "reverse" : true
    };

    var svgCircle = new SvgAnimation(svgAnimSettings);

    svgCircle.animate(function(response){
        console.log(response);
    });
 =====================================
 @author: me@habibhadi.com
 @authorUrl: http://habibhadi.com
 */
function SvgAnimation(settings){
    this.svg            = $(settings.elem);
    this.increaseBy     = settings.increaseBy !== undefined ? settings.increaseBy : 5;
    this.timeout        = settings.timeout !== undefined ? settings.timeout : 1;
    this.reverse        = settings.reverse !== undefined ? settings.reverse : false;

    this.currentPath    = 1;
    this.totalPath      = 0;

    this.init();
}

SvgAnimation.prototype.animate = function(callback) {
    ( typeof(callback) == 'function' ) ? this.runAnimation(callback) : this.runAnimation();
}

SvgAnimation.prototype.init = function(){
    var reseve = this.reverse;
    this.svg.find('path').each(function(index, el) {
        var path = el,
            $path = $(el),
            pathLength = el.getTotalLength();

        $path.attr('stroke-dasharray', pathLength+' '+pathLength)
            .attr('stroke-dashoffset', ((reseve===true) ? -pathLength : pathLength) );
    });
}

SvgAnimation.prototype.runAnimation = function(callback){
    this.totalPath = this.svg.find('path').length;

    var settings = {
        currentPath : this.currentPath,
        totalPath : this.totalPath,
        pathElem : this.svg.find('path:eq('+ (this.currentPath-1) +')')
    };

    this.pathAnimation(callback, settings);
}

SvgAnimation.prototype.pathAnimation = function(callback, settings){

    var _this       = this,
        self        = settings.pathElem,
        counter     = parseFloat(self.attr('stroke-dashoffset')),
        increaseBy  = this.increaseBy,
        timeout     = setInterval(function(){
            if ( (_this.reverse === true && counter >= 0) || (_this.reverse === false && counter <= 0) ) {
                clearInterval(timeout);
                if( typeof(callback) == 'function' ) callback.call( this, { obj: self, current: settings.currentPath, total: _this.totalPath } );

                settings.currentPath++;
                if( settings.currentPath <= _this.totalPath ) {
                    var nextSettings = {
                        currentPath : settings.currentPath,
                        pathElem : _this.svg.find('path:eq('+ (settings.currentPath-1) +')')
                    };
                    _this.pathAnimation(callback, nextSettings);
                }

            } 
            else {
                if( _this.reverse === true ) {
                    counter += increaseBy;
                    self.attr('stroke-dashoffset', (counter >= 0) ? 0 : counter);
                }
                else {
                    counter -= increaseBy;
                    self.attr('stroke-dashoffset', (counter <= 0) ? 0 : counter);
                }
                
            }
        }, this.timeout);

}