<?php
class Session extends CI_Model {

	public function create($name, $pegs, $rows, $colors){
		$settings = array(
			'name' => $name,
			'pegs' => $pegs,
			'rows' => $rows,
			'colors' => $colors
		);
		$this->db->insert('sessions', $settings);
	}

}