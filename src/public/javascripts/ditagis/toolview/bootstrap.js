define([
], function () {
    'use strict';
    return class Bootstrap {
        static setModalMaxHeight(element) {
            this.$element = $(element);
            this.$content = this.$element.find('.modal-content');
            var borderWidth = this.$content.outerHeight() - this.$content.innerHeight();
            var dialogMargin = $(window).width() < 768 ? 20 : 60;
            var contentHeight = $(window).height() - (dialogMargin + borderWidth);
            var headerHeight = this.$element.find('.modal-header').outerHeight() || 0;
            var footerHeight = this.$element.find('.modal-footer').outerHeight() || 0;
            var maxHeight = contentHeight - (headerHeight + footerHeight);

            this.$content.css({
                'overflow': 'hidden'
            });

            this.$element
                .find('.modal-body').css({
                    'max-height': maxHeight,
                    'overflow-y': 'auto'
                });
        }
        static modal(id, title, body, footer,options={}) {
            if (!id || !title || !body) throw 'id, title, body cannot null';
            try {
                let width = document.body.getBoundingClientRect().width;
                let _modal, modalDlg, modalContent, modalHeader, modalBody, modalFooter;
                _modal = document.createElement('div');
                _modal.classList.add('modal', 'fade');
                _modal.id = id;
                _modal.setAttribute('tabindex', '-1');
                _modal.setAttribute('role', 'dialog');
                _modal.setAttribute('aria-labelledby', 'myModalLabel');
                _modal.setAttribute('aria-hidden', 'true');
                modalDlg = document.createElement('div');
                modalDlg.classList.add('modal-dialog');
                if(options.dlgLarge)
                modalDlg.classList.add('modal-lg');
                modalContent = document.createElement('div');
                modalContent.classList.add('modal-content');
                modalHeader = document.createElement('div');
                modalHeader.classList.add('modal-header');
                let closeBtn = document.createElement('button');
                closeBtn.type = 'button';
                closeBtn.classList.add('close');
                closeBtn.setAttribute('data-dismiss', 'modal');
                closeBtn.innerHTML = '<span aria-hidden="true">×</span><span class="sr-only">Đóng</span>';
                modalHeader.appendChild(closeBtn);
                modalHeader.innerHTML += `<h4 class="modal-title">${title}</h4>`;
                modalBody = document.createElement('div');
                modalBody.classList.add('modal-body');
                if (typeof body === 'object')
                    modalBody.appendChild(body);
                else if (typeof body === 'string')
                    modalBody.innerHTML += body;
                else return null;
                if (footer) {
                    modalFooter = document.createElement('div');
                    modalFooter.classList.add('modal-footer')
                    modalFooter.appendChild(footer);
                }
                modalContent.appendChild(modalHeader);
                modalContent.appendChild(modalBody);
                if (modalFooter) modalContent.appendChild(modalFooter);
                modalDlg.appendChild(modalContent);
                _modal.appendChild(modalDlg);
                document.body.appendChild(_modal);
                let $modal = $(`#${id}`);
                if ($modal) {
                    $modal.on('hidden.bs.modal', function () {
                        $modal.remove();
                    })
                    $modal.on('show.bs.modal', function () {
                        $(this).show();
                        Bootstrap.setModalMaxHeight(this);
                    });

                    $(window).resize(function () {
                        if ($('.modal.in').length != 0) {
                            Bootstrap.setModalMaxHeight($('.modal.in'));
                        }
                    });
                    return $modal;
                }
                else {
                    return null;
                }
            } catch (error) {
                throw error;
            }
        }
        static table(columns) {
            let tableResponsive = document.createElement('div');
            tableResponsive.classList.add('table-responsive');
            //TABLE ON DIV
            let table = document.createElement('table');
            table.classList.add('table');
            table.style.whiteSpace = 'nowrap';
            tableResponsive.appendChild(table);
            //THEAD ON TABLE
            let thead = document.createElement('thead');
            let html = '<tr>'
            for (const item of columns) {
                html += '<th>' + item + '</th>';
            }
            html += '</tr>'
            thead.innerHTML = html;
            table.appendChild(thead);
            //TBODY ON TABLE
            let tbody = document.createElement('tbody');
            table.appendChild(tbody);
            return tableResponsive;
        }
        static setTableRow(table, rows) {
            let tbody = table.getElementsByTagName('tbody')[0];
            tbody.innerHTML = '';
            for (const row of rows) {
                Bootstrap.addTableRow(table, row);
            }
        }
        static addTableRow(table, row) {
            let tr = document.createElement('tr');
            for (const i in row) {
                let value = row[i];
                let td = document.createElement('td');
                td.innerText = value;
                tr.appendChild(td);
            }
            let tbody = table.getElementsByTagName('tbody')[0];
            tbody.appendChild(tr);
        }
    }
});