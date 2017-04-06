<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller {

	public function __construct(){
		parent::__construct();
		$this->load->model('session');
		$this->load->model('step');
	}

	private function isGet()
	{
		if($this->input->method() === "get") return true;
		return false;
	}

	private function isPost($param = false)
	{
		if($this->input->method() === "post"){
			//if($param != false || $param == null) return $this->input->post($param, true); 
			return true;	
		}
		return false;
	}

	private function isDelete()
	{
		if($this->input->method() === "delete") return true;
		return false;
	}

	private function sendJson($arr, $status_header = 200)
	{
		return $this->output
					->set_content_type('application/json')
					->set_status_header($status_header)
					->set_output(json_encode($arr));
	}

	public function create_game()
	{
		if($this->isPost()){
			$pegs = $this->input->post('pegs');
			$rows = $this->input->post('rows');
			$colors = $this->input->post('colors');

			$name = md5(microtime());

			$this->session->create($name, $pegs, $rows, $colors);

			return $this->sendJson(array(
				'status' => 'Success',
				'session_name' => $name
			));
		}

		return $this->sendJson(array(
			'status' => 'Forbidden'
		), 403);
	}

	public function save_step()
	{
		if($this->isPost()){
			$session_name = $this->input->post('session_name');
			$row = $this->input->post('row');
			$move = $this->input->post('move');

			$success = $this->step->create($session_name, $row, $move);

			if($success){
				return $this->sendJson(array(
					'status' => 'Success'
				));
			}

			return $this->sendJson(array(
				'status' => 'Failed'
			), 500);
		}

		return $this->sendJson(array(
			'status' => 'Forbidden'
		), 403);
	}

	public function get_session()
	{
		if($this->isGet()){
			$session_name = $this->input->get('session_name');

			$result = $this->session->get($session_name);

			$isActive = !empty($result);

			return $this->sendJson(array(
				'status' => 'Success',
				'is_active' => $isActive,
				'rows' => $result['rows'],
				'pegs' => $result['pegs'],
				'colors' => $result['colors']
			));
		}

		return $this->sendJson(array(
			'status' => 'Forbidden'
		), 403);
	}

	public function load_game()
	{
		if($this->isGet()){
			$session_name = $this->input->get('session_name');

			$results = $this->session->get_steps($session_name);

			$steps = [];

			for($i=0; $i<count($results); $i++){
				$steps[$results[$i]['row']] = $results[$i]['move'];
			}

			return $this->sendJson(array(
				'status' => 'Success',
				'steps' => $steps
			));
		}

		return $this->sendJson(array(
			'status' => 'Forbidden'
		), 403);
	}
}
