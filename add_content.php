<?php
	/*
	标题 描述
	首页上出现 标题和回答中最热门的部分
	评论 
	*/
	
	/*
	标题 ，描述+评论 (用评论代替回答)
	*/
	
	sleep(3);
	require 'config.php';
	
	$query="INSERT INTO question (titleid,content,user,date) VALUES ('{$_POST['titleid']}','{$_POST['content']}','{$_POST['user']}',NOW())";
	
	mysql_query($query) or die('新增失败！'.mysql_error());
	
	echo mysql_affected_rows();
	
	mysql.close();
?>