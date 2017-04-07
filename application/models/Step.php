<?php
class Step extends CI_Model {

	public function __construct()
    {
		$this->load->database();
    }

    public function create($session_name, $row, $move)
    {
    	$session = $this->db->get_where('sessions', array('name' => $session_name))->result_array()[0];

    	$step = array(
    		'session_id' => $session['id'],
    		'row' => $row,
    		'move' => $move
    	);

    	$result = $this->db->insert('steps', $step);

    	return !empty($result);
    }

    public function delete_from_session($session_id)
    {
    	return $this->db->delete('steps', array('session_id' => $session_id));
    }

}