using UnityEngine;
using System.Collections;

public class healthScript : MonoBehaviour {
	public float health;
	public static bool isPlayerAlive = true;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if (health < 0f) {
			Destroy (gameObject);
		}
	
	
	}
}
