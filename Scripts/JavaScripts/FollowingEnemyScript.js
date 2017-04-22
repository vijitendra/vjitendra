#pragma strict
var damp = 3.0;
var enemySpeed = 7.0;
var timer = 0.0;
var enemyTransform : Transform;
var target : Transform;
var bullet : Transform;
var bulletSpawn : Transform;
function Start () {

}

function Update () {

}

function OnTriggerStay(targetCollided : Collider)
{
timer += Time.deltaTime;
var positionDifference = target.position - enemyTransform.position;
if (targetCollided.transform.name == ("Player"))
{
var rotate = Quaternion.LookRotation(target.position - enemyTransform.position);
enemyTransform.rotation = Quaternion.Slerp(enemyTransform.rotation, rotate,Time.deltaTime);
if (timer > 4.0)
{
Instantiate(bullet, bulletSpawn.position, bulletSpawn.rotation);
timer = 0.0;
}
if (Mathf.Abs(positionDifference.x) >= 4.0 || Mathf.Abs(positionDifference.z) >= 4.0)
{
enemyTransform.transform.Translate(Vector3.forward * Time.deltaTime * enemySpeed);
}
}
}

