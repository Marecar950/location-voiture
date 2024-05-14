<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;

class UserController extends AbstractController
{
    #[Route('/user', name: 'app_user')]
    public function index(): Response
    {
        return $this->render('user/index.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }

    #[Route('/user/register', name: 'app_user_register', methods: ['POST'])]
    public function register(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $JWTManager, EntityManagerInterface $entityManager): Response
    {
        $civility = $request->request->get('civility');
        $lastname = $request->request->get('lastname');
        $firstname = $request->request->get('firstname');
        $dateOfBirth = $request->request->get('dateOfBirth');
        $birthdate = DateTimeImmutable::createFromFormat('Y-m-d', $dateOfBirth);
        $email = $request->request->get('email');
        $plainPassword = $request->request->get('password');

        $verifyEmail = $userRepository->findOneBy(['email' => $email]);

        if ($verifyEmail) {
            return $this->json(['error' => 'Cet adresse email existe déjà']);
        } else {
            $user = new User();
            $user->setCivility($civility);
            $user->setLastname($lastname);
            $user->setFirstname($firstname);
            $user->setEmail($email);
            $user->setDateOfBirth($birthdate);
            $hashedPassword = $passwordHasher->hashPassword($user, $plainPassword);
            $user->setPassword($hashedPassword);
            $token = $JWTManager->create($user);
            $user->setToken($token);
            $user->setRoles(['ROLE_USER']);
            $user->setEmailConfirmed(true);

            $entityManager->persist($user);
            $entityManager->flush();

            $transport = Transport::fromDsn('smtp://mouzammilm2000@gmail.com:mxplqafctfekqicu@smtp.gmail.com:587');
            $mailer = new Mailer($transport);

            $Email = new Email();

            $Email->from('mouzammilm2000@gmail.com');
            $Email->to($user->getEmail());
            $Email->subject('Confirmation de votre inscription');
            $Email->html('<p>Veuillez cliquer sur le lien pour confirmer votre inscription : </p><a href="https://location-voiture.mouzammil-marecar.fr/confirm_registration/' . $token . '">https://location-voiture.mouzammil-marecar.fr/confirm_registration/'. $token .'</a>');

            $mailer->send($Email); 
        }

        return $this->json(['message' => 'Veuillez vérifier votre adresse email pour confirmer votre inscription.']);
    }

    #[Route('/user/confirm_registration', name: 'app_user_confirm_registration', methods: ['GET'])]
    public function confirmRegistration(Request $request, EntityManagerInterface $entityManager): Response
    {
        $token = $request->query->get('token');

        $user = $entityManager->getRepository(User::class)->findOneBy(['token' => $token]);

        if (!$user) {
            return $this->json(['error' => 'Token invalide']);
        } else {
            $user->setToken(null);
            $user->setEmailConfirmed(true);
            $entityManager->flush();
        }

        return $this->json(['message' => 'Votre inscription a été confirmée avec succès']);
    }

    #[Route('/user/login', name: 'app_user_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher): Response
    {
        $email = $request->request->get('email');
        $plainPassword = $request->request->get('password');

        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$passwordHasher->isPasswordValid($user, $plainPassword)) {
            return $this->json(['error' => 'Adresse email ou mot de passe incorrect']);
        }

        $roles = $user->getRoles();

        if (!$user->isEmailConfirmed()) {
            if(in_array('ROLE_USER', $roles)) {
                return $this->json(['role' => 'ROLE_USER']);
            } else {
                return $this->json(['role' => $roles,
                                    'message' => "Connexion réussie en tant qu'utilisateur."]);
            }
        } else {
            return $this->json(['error' => 'Adresse email ou mot de passe incorrect']);
        }
    }

    #[Route('/user/verify_mail', name: 'app_user_verify_mail', methods: ['GET'])]
    public function verifyMail(Request $request, EntityManagerInterface $entityManager, JWTTokenManagerInterface $JWTManager): Response
    {
        $email = $request->query->get('email');

        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user) {
            return $this->json(['error' => "Nous n'avons pas trouvé cet adresse email"]);
        }
        
            $token = $JWTManager->create($user);

            $user->setToken($token);
            $entityManager->flush();

            $transport = Transport::fromDsn('smtp://mouzammilm2000@gmail.com:mxplqafctfekqicu@smtp.gmail.com:587');
            $mailer = new Mailer($transport);

            $Email = new Email();

            $resetPasswordUrl = 'https://location-voiture.mouzammil-marecar.fr/reset_password/' .$token;

            $Email->from('mouzammilm2000@gmail.com')
                  ->to($user->getEmail())
                  ->subject('Réinitialisation de votre mot de passe')
                  ->html('<p>Veuillez cliquer sur le lien pour réinitialiser votre mot de passe : </p><a href=" '.$resetPasswordUrl .'"> '.$resetPasswordUrl.'</a>');

            $mailer->send($Email);

            return $this->json(['message' => 'Un e-mail vous a été envoyé pour réinitialiser votre mot de passe.']);
    }

    #[Route('/user/verify_token', name: 'app_user_verify_token', methods: ['GET'])]
    public function verifyToken(Request $request, UserRepository $userRepository, EntityManagerInterface $entityManager): Response
    {
        $token = $request->query->get('token');

        $user = $userRepository->findOneBy(['token' => $token]);

        if (!$user) {
            return $this->json(['error' => 'Token invalide']);
        }

        $user->setEmailConfirmed(true);
        $entityManager->flush();
        
        return $this->json(['success' => $user->getToken()]);
    }

    #[Route('/user/reset_password', name: 'app_user_reset_password', methods: ['PUT'])]
    public function resetPassword(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): Response
    {
        $content = $request->getContent();
        $data = json_decode($content, true);

        $plainPassword = $data['password'];
        $token = $data['token'];

        $user = $entityManager->getRepository(User::class)->findOneBy(['token' => $token]);

        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $plainPassword
        );

        if (!$user) {
            return $this->json(['error' => 'Token invalide pour la réinitialisation du mot de passe.']);
        } else {
            $user->setPassword($hashedPassword);
            $user->setToken(null); 
            $entityManager->flush();
        }

        return $this->json(['message' => 'Votre mot de passe a bien été mis à jour.']);
    }
}
