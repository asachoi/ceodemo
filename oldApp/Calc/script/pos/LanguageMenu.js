/* © 2014 Aleph-labs.com
 * @author Thang Kieu. Revised by Ernesto Pile
 */
// namespace
var pos = pos || {};

(function(pos, $, Templates, I18nHelper) {
    'use strict';

    /**
     * LanguageMenu component
     * @class
     * @param {[type]} element [description]
     * @param {[type]} options [description]
     */
    function LanguageMenu(options) {

        this.options   = $.extend({}, LanguageMenu.DEFAULTS, options);
		this.options.model = {
			items:	window.Manulife.shell.languages
		};
		     
        this.insertToDOM();
        this.initComponent();
        this.bindEvents(true);
     }


    LanguageMenu.DEFAULTS = {
        "container":".language-menu"
    };


    LanguageMenu.prototype = {
        constructor: LanguageMenu,

        $el: null,
        el: null,
        

        initComponent: function() {

            var self = this;
           
        },

        bindEvents: function(isActiveEvent) {
            var self = this;

            if(isActiveEvent){
                               
                $(".language-menu-item").on("click", function(){
                    var languageId = $(this).attr("data-language");
                    console.log("language menu click:"+languageId);
                    I18nHelper.setLng(languageId);
                });      
                 
                
	            $(window).resize(function(){
	                self.updateLayout();
	            });
	            this.updateLayout();
	        }
	        else{


	        		
	        }

        },

       
        insertToDOM: function(){

            if(this.options.element){
                this.$el = $(this.options.element);
            }
            else{
                this.$el = $(this.getDocumentHTML());
                this.$container  = $(this.options.container);
                
                if(this.options.container){
                    if(this.options.containerPosition == "prepend"){
                        this.$container.prepend(this.$el);
                    }
                    else{
                        this.$container.append(this.$el);
                    }
                }
            }
            this.el = this.$el[0];
        },



        getDocumentHTML : function() {
        	var template = Templates.getTemplate('language-menu');
            return 	template(this.options.model);
        },


        updateLayout: function(){

        }   

    };

    // exports
    pos.LanguageMenu = LanguageMenu;
}(pos, jQuery, app.Templates, app.I18nHelper));