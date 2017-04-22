#pragma strict
var bullet : Transform;

function Start () {

}

function Update () {
if (Input.GetKeyDown("Space"))
{
Instantiate(bullet, transform.position,transform.rotation);
}

}