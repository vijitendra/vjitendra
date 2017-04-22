#pragma strict
var Player :Transform;

function Start () {

}

function Update () {

}
function OnCollisionEnter(collision : Collision)
{
if (collision.transform == Player)
{
Destroy(gameObject);
}
}