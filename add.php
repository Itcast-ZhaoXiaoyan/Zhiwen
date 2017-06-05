<?php
	header('Content-Type:text/html;charset=utf-8');
		
	//睡眠3s
	sleep(3);
	
	//引入初始化文件
	require 'config.php';
	
	//新增sql语句；
	$query="INSERT INTO user (user,pass,email,sex,birthday,date) 
			VALUES ('{$_POST['user']}',shal('{$_POST['pass']}'),'{$_POST['email']}','{$_POST['sex']}','{$_POST['birthday']}',NOW())";
	
	mysql_query($query) or die('新增失败！'.mysql_error());
	echo mysql_affected_rows();
	mysql_close();
?>