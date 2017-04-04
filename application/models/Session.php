<?php
class Session extends CI_Model {

	public function __construct()
    {
		$this->load->database();
    }

	public function create($name, $pegs, $rows, $colors)
	{
		$settings = array(
			'name' => $name,
			'pegs' => $pegs,
			'rows' => $rows,
			'colors' => $colors
		);

		return $this->db->insert('sessions', $settings);
	}

	public function exists($name)
	{
		$query = $this->db->get_where('sessions', array('name' => $name));
		$result = $query->result_array()[0];

		return isset($result);
	}

}