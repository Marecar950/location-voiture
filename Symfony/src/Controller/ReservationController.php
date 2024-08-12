<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Reservation;
use App\Repository\ReservationRepository;
use App\Repository\UserRepository;
use App\Repository\VoitureRepository;
use Doctrine\ORM\EntityManagerInterface;
use DateTimeImmutable;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
;use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;
use Symfony\Component\HttpFoundation\JsonResponse;

class ReservationController extends AbstractController
{
    #[Route('/reservation', name: 'app_reservation')]
    public function index(): Response
    {
        return $this->render('reservation/index.html.twig', [
            'controller_name' => 'ReservationController',
        ]);
    }

    #[Route('/reservation/create', name: 'app_reservation_create', methods: ['POST'])]
    public function createReservation (Request $request, UserRepository $userRepository, VoitureRepository $voitureRepository, EntityManagerInterface $entityManager): Response
    {

        $lieuDepart = $request->request->get('lieuDepart');
        $dateDepart = $request->request->get('dateDepart');
        $formatted_dateDepart = DateTimeImmutable::createFromFormat('Y-m-d', $dateDepart);
        $dateRetour = $request->request->get('dateRetour');
        $formatted_dateRetour = DateTimeImmutable::createFromFormat('Y-m-d', $dateRetour);

        $userId = $request->request->get('userId');
        $email = $request->request->get('email');
        $voitureId = $request->request->get('voitureId');

        $user = $userRepository->find($userId);
        $voiture = $voitureRepository->find($voitureId);

        $reference = uniqid('ref_');

        $reservation = new Reservation();
        $reservation->setUser($user);
        $reservation->setVoiture($voiture);
        $reservation->setLieuDepart($lieuDepart);
        $reservation->setDateDepart($formatted_dateDepart);
        $reservation->setDateRetour($formatted_dateRetour);
        $reservation->setReference($reference);
        $reservation->setStatut('Confirmée');

        $entityManager->persist($reservation);
        $entityManager->flush();

        $transport = Transport::fromDsn('smtp://mouzammilm2000@gmail.com:mxplqafctfekqicu@smtp.gmail.com:587');
        $mailer = new Mailer($transport);

        $Email = new Email();
        $Email->from('mouzammilm2000@gmail.com')
              ->to($email)
              ->subject('Confirmation de votre réservation de votre véhicule')
              ->html("<p>Bonjour,</p>
                      <p>Voici les détails de votre réservation :</p>
                      <ul>
                        <li><strong>Référence de votre réservation :</strong> $reference </li>
                      </ul>
                      <p>Nous vous souhaitons un agréable voyage.</p>
                      <p>Cordialement,</p>
                      <p>L'équipe de location de voiture</p>      
                    ");

        $mailer->send($Email);            

        return $this->json(['message' => 'Merci de votre réservation. Nous avons envoyé une confirmation de votre réservation à votre adresse email.']);
    }

    #[Route('/user/reservations', name: 'user_reservations', methods: ['GET'])]
    public function getUserReservations(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $userId = $request->query->get('user_id');
        $user = $entityManager->getRepository(User::class)->find($userId);

        $reservations = $entityManager->getRepository(Reservation::class)->findBy(['user' => $user]);

        $data = [];

        foreach ($reservations as $reservation) {
            $data[] = [
                'id' => $reservation->getId(),
                'reference' => $reservation->getReference(),
                'lieuDepart' => $reservation->getLieuDepart(),
                'dateDepart' => $reservation->getDateDepart()->format('Y-m-d'),
                'dateRetour' => $reservation->getDateRetour()->format('Y-m-d'),
                'statut' => $reservation->getStatut()
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/reservation/cancel/{id}', name: 'reservation_cacncel', methods: ['PUT'])]
    public function cancelReservation(EntityManagerInterface $em, int $id)
    {
        $reservation = $em->getRepository(Reservation::class)->find($id);

        $reservation->setStatut('Annulé');
        $em->persist($reservation);
        $em->flush();

        return new JsonResponse(['success' => 'Votre réservation a été annulée']);
    }

    #[Route('/reservations', name: 'reservations', methods: ['GET'])]
    public function getReservations(ReservationRepository $reservationRepository): JsonResponse
    {
            $reservations = $reservationRepository->findAll();

            if (empty($reservations)) {
                return new JsonResponse(['error' => 'Aucune réservation']);
            }

            return $this->json($reservations);
    }
}