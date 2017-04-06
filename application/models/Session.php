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

	public function get($name)
	{
		$query = $this->db->get_where('sessions', array('name' => $name));
		$result = $query->result_array()[0];

		return $result;
	}

	public function get_steps($name)
	{
		//$session_id = $this->db->get_where('sessions', array('name' => $name))->result_array()[0]['id'];

		$this->db->select('row, move');
		$this->db->from('sessions');
		$this->db->where('name', $name);
		$this->db->join('steps', 'steps.session_id = sessions.id');

		$result = $this->db->get()->result_array();

		return $result;
	}

}