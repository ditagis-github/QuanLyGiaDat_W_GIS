/**
 * Điều khiển một preloading khi chạy trang web
 */
class Loader {
    /**
     * Hiển thị một trang loading
     */
    static show() {
        var wrapper = document.createElement('div');
        wrapper.id = 'loader-wrapper';
        var loader = document.createElement('div');
        loader.id = 'loader';
        wrapper.appendChild(loader);
        document.body.appendChild(wrapper);
    }
    /**
     * ẩn trang loading
     */
    static hide() {
        document.body.removeChild(document.getElementById('loader-wrapper'));
    }

}