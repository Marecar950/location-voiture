<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use App\Entity\User;

class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $user = $event->getUser();
        $payload = $event->getData();

        if ($user instanceof User) {
            $payload['lastname'] = $user->getLastname();
            $payload['firstname'] = $user->getFirstname();
            $payload['email'] = $user->getEmail();
            $payload['dateOfBirth'] = $user->getDateOfBirth();
        }

        $event->setData($payload);
    }
}