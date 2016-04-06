<?php 

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));

// retrieve the dataPoint and key from the path
$dataPoint = preg_replace('/[^a-z0-9_\-]+/i','',array_shift($request));
$key = array_shift($request)+0; //not used currently

$data;
switch ($method) {
  case 'GET':
    $data = file_get_contents('data/' . $dataPoint . '.json');
    echo $data;
    break;
  case 'PUT':
    parse_str(file_get_contents('php://input'), $_PUT);
    //write file
    echo $_PUT['data'];
    break;
  case 'POST':
    //write file
    file_put_contents('./data/' . $dataPoint . '.json', $_POST['data']);
    break;
  case 'DELETE':
    //write file
    break;
}
?>