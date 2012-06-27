
import pygtk
import os
pygtk.require('2.0')
import gtk
import webkit

realpath = os.path.dirname(os.path.realpath( __file__ ))

class Base:
	def __init__(self):

		view = webkit.WebView()
		settings = view.get_settings()
		settings.set_property('enable-file-access-from-file-uris', 1)
		view.open(realpath +'/examples/nh_page/index.html')

		self.window = gtk.Window(gtk.WINDOW_TOPLEVEL)
		self.window.set_size_request(320, 480)
		
		self.window.show()
		self.window.add(view)
 		view.show()
 		#view.set_default_size(1000,1000)
 		self.window.set_resizable(0)

	def main(self):
		gtk.main()

base = Base()
base.main()

