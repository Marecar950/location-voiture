<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Repository\AdminRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SecurityController extends AbstractController
{
    #[Route('/security', name: 'app_security')]
    public function index(): Response
    {
        return $this->render('security/index.html.twig', [
            'controller_name' => 'SecurityController',
        ]);
    }

    #[Route('/login', name: 'user_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository, AdminRepository $adminRepository, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $JWTManager): JsonResponse
    {
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        $user = $userRepository->findOneBy(['email' => $email]);

        if ($user) {

            if (!$passwordHasher->isPasswordValid($user, $password)) {
                return new JsonResponse(['error' => 'Adresse email ou mot de passe incorrect']);
            }

            $token = $JWTManager->create($user);

            $userData = [
                'id' => $user->getId(),
                'lastname' => $user->getLastname(),
                'firstname' => $user->getFirstname(),
                'email' => $user->getEmail(),
                'dateOfBirth' => $user->getDateOfBirth()->format('d/m/Y'),
                'roles' => $user->getRoles()
            ];

            return new JsonResponse([
                'token' => $token,
                'user' => $userData
            ]);
        } else {
            $admin = $adminRepository->findOneBy(['email' => $email]);

            if ($admin) {

                if (!$passwordHasher->isPasswordValid($admin, $password)) {
                    return new JsonResponse(['error' => 'Adresse email ou mot de passe incorrect']);
                }

                return new JsonResponse(['admin' => $admin->getRoles()]);
            }
        }
            
    }
}
