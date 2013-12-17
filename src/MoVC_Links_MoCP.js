(function() {

        window.define ? define([], callback) : callback();

        function callback() {
                var MoJS = window.MoJS || (window.MoJS = {});
                MoJS.MoVC_MoCP_Integration || (MoJS.MoVC_MoCP_Integration = MoVC_MoCP_Integration);

                return MoVC_MoCP_Integration;
        }


        /**
         *  Before any action is fired we will add some properties to the request
         *
         *      MoCP
         *      render
         *      renderFile
         *      renderText
         *      renderPartial
         *
         * to the request of MoVC
         *
         * The request of MoVC is then passed on to MoCP for further use in templates
         * @constructor
         */
        function MoVC_MoCP_Integration() {
                var before = {
                        filter : function(params) {
                                var request = this;

                                if ( !request.MoCP && MoJS.MoCP ) {
                                        request.MoCP = MoJS.MoCP;
                                }

                                // If MoCP is defined, then add these methods as well,
                                // as long as they are not added already added
                                if ( request.MoCP ) {
                                        addFunc(request, 'render');
                                        addFunc(request, 'renderFile');
                                        addFunc(request, 'renderText');
                                        addFunc(request, 'renderPartial');
                                }
                        }
                };



                !function constructor() {
                        MoJS.MoVC.options.filters.before.push(before);
                }();

                function addFunc(request, key) {
                        // xyz can be a file, text or partial depending on what key is ( render, renderFile, renderPartial)
                        request[key] || (request[key] = function(xyz, model, promise) {
                                model || (model = {});                                          // Ensure model

                                var argsRender = [xyz, model, promise];
                                var argsFilter = [argsRender];
                                argsFilter.push.apply(argsFilter, request.arguments);           // Move over the request params

                                var returns  = request.fnBeforeView.apply(this, argsFilter);    // Call beforeView if there are any
                                if ( returns === false ) return false;

                                if ( returns ) {
                                        argsRender = returns;
                                }

                                model.request = request;                                        // Hookup request on model

                                return request.MoCP[key].apply(undefined, argsRender);
                        });
                }
        }

})();