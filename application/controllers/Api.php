<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller {

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

			

			return $this->sendJson(array(
				'status' => 'Success',
				'test' => $this->input->post()
			));
		}

		return $this->sendJson(array(
			'status' => 'Forbidden'
		), 403);
	}
}
