<?php
	// Hàm thi?t l?p là dã dang nh?p
    function set_logged($username, $level){
        session_set('ss_user_token', array(
            'username' => $username,
            'level' => $level
        ));
    }
     
    // Hàm thi?t l?p dang xu?t
    function set_logout(){
        session_delete('ss_user_token');
    }
     
    // Hàm ki?m tra tr?ng thái ngu?i dùng dã dang h?p chua
    function is_logged(){
        $user = session_get('ss_user_token');
        return $user;
    }
     
    // Hàm ki?m tra có ph?i là admin hay không
    function is_admin(){
        $user  = is_logged();
        if (!empty($user['level']) && $user['level'] == '1'){
            return true;
        }
        return false;
    }
    
    
    // L?y username ngu?i dùng hi?n t?i
    function get_current_username(){
        $user  = is_logged();
        return isset($user['username']) ? $user['username'] : '';
    }
     
    // L?y level ngu?i dùng hi?n t?i
    function get_current_level(){
        $user  = is_logged();
        return isset($user['level']) ? $user['level'] : '';
    }

?>