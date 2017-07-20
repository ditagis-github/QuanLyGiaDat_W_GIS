
    <?php include('templates/header.php')?>
    <script>
        Loader.show();
        </script>
        <div class="container">
            <section class="fh-inner-banner" id="fh-grid-map">
                <div id="map">
                </div>
                <!-- Modal -->
                <div class="modal fade" id="updatePrice" role="dialog">
                    <div class="modal-dialog modal-sm">
                        <div class="modal-content">
                            <form id="supply-price-form" role="form">
                                <legend>Cung cấp giá đất</legend>
                                <div class="modal-body">
                                    <div class="form-group">
                                        <label for="name">Họ và tên</label>
                                        <input type="text" class="form-control" name="name" id="name" placeholder="Họ và tên ">
                                    </div>
                                    <div class="form-group">
                                        <label for="phoneNumber">Số điện thoại</label>
                                        <input type="text" class="form-control input-medium bfh-phone" data-format="ddd dddd dddd" name="phonenumber" id="phonenumber"
                                            placeholder="Số điện thoại ">
                                    </div>
                                    <div class="form-group">
                                        <label for="price">Giá đất</label>
                                        <input type="number" class="form-control" name="price" id="price" placeholder="Giá đất ">
                                    </div>

                                    <input type="hidden" name="thuadatid" id="thuadatid">
                                    <input type="hidden" name="loaithuadat" id="loaithuadat">

                                </div>

                                <div class="modal-footer">
                                    <button type="submit" class="btn btn-submit">Cập nhật</button>
                                    <button type="button" class="btn btn-default" data-dismiss="modal">Đóng</button>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>
            </section>
             <!--<script src="https://cdnjs.cloudflare.com/ajax/tracuugiadat/jquery.form/4.2.1/jquery.form.min.js" integrity="sha384-tIwI8+qJdZBtYYCKwRkjxBGQVZS3gGozr3CtI+5JF/oL1JmPEHzCEnIKbDbLTCer" crossorigin="anonymous">

  $(document).ready(function () {
    $('#supply-price-form').ajaxForm({
      url: 'supplyprice.php',
      type: 'post',
      dataType: 'json',
      success: function (response, status) {
        if (typeof response.error != undefined) {
          $('#updatePrice').modal('toggle');
          alert(response.message);
        } else {
          alert(response.message);
        }
      }
    });
    $('#price').on('focus', function () {
      $(this).val('');
    });
  });</script>-->
  
  </div>
  <script async src="js/lib/require.js" data-main="js/app.js"></script>
        <?php include('templates/footer.php')?>