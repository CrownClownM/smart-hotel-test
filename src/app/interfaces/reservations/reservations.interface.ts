export interface reservationsData {
  id:                      string;
  contact_emergency_name:  string;
  contact_emergency_phone: string;
  hotel:                   string;
  room:                    string;
  price:                   number;
  roomId:                  string;
  start_date:              Date;
  end_date:                Date;
  passengers:              Passenger[];
}

export interface Passenger {
  phone:         string;
  document_type: string;
  email:         string;
  birthdate:     Date;
  document:      string;
  gender:        string;
  name:          string;
  id:            string;
}
