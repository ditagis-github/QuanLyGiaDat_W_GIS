define([

], function () {
    'use strict';
    return class {
        static modal(options={},style={}) {
            let id = options.id || null,
            title = options.title||'',
            body = options.body || '',
            footer = options.footer ||'';
            let width = style.width || 500;

            let html = `<div class="modal fade" id="${id}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content" style="width:${width}px">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                                    <h4 class="modal-title">${title}</h4>
                                </div>
                                <div class="modal-body">
                                    ${body}
                                </div>
                                ${footer?'<div class="modal-footer"</div>':''}
                            </div>
                        </div>
                    </div>`
            $('body').append(html);
            let modal = $(`#${id}`);
            if(modal){
                modal.on('hidden.bs.modal',function(){
                    modal.remove();
                })
                return modal;
            }
            else{
return null;
            }
            
        }
    }
});